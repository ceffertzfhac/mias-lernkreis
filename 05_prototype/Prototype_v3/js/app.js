/**
 * Mias Lernkreis — Solo App
 * Alpine.js state & methods
 * Depends on: config.js, api.js, radar.js
 */

// ─── Storage helpers ──────────────────────────────────────────────────────────
const store = {
  get:      key  => JSON.parse(localStorage.getItem(STORAGE_PREFIX + key) ?? 'null'),
  set:      (k, v) => localStorage.setItem(STORAGE_PREFIX + k, JSON.stringify(v)),
  clearAll: () => Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX)).forEach(k => localStorage.removeItem(k)),
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
const dateFromNow  = days => { const d = new Date(); d.setDate(d.getDate() + days); return d }
const toDateInput  = date => (date instanceof Date ? date : new Date(date)).toISOString().split('T')[0]
const todayInput   = () => toDateInput(new Date())

// ─── Alpine App ───────────────────────────────────────────────────────────────
function app() {
  return {

    // ── Screen ──────────────────────────────────────────────────────────────
    screen: 'setup',

    // ── Setup ───────────────────────────────────────────────────────────────
    name: '',
    apiKey: '',
    apiModel: 'gpt-5.2',
    examDateInput: toDateInput(dateFromNow(45)),
    apiTest: { status: null, message: '' }, // null | loading | ok | error

    // ── Kurs (course = radar axis definition) ────────────────────────────────
    kurs: ACTIVE_KURS,

    // ── Kursinhalt (pre-generated deterministic content) ─────────────────────
    kursinhalt: null,             // parsed kurs-inhalt.json or null
    kursinhaltStatus: { ok: null, msg: '' },

    // ── Diagnose ────────────────────────────────────────────────────────────
    diagnosen: [],          // [{ datum: ISO, bewertungen: [{id, stufe}] }]
    aktBewertungen: [],     // [{id, stufe: 1-5 | null}]
    verifikation: { aktiv: false, themaId: null, stufe: null, frage: '', loading: false },

    // ── Radar ────────────────────────────────────────────────────────────────
    showVerlauf: false,

    // ── Übung ────────────────────────────────────────────────────────────────
    ue: {
      themaId: 1, typ: 'erklären', schwierigkeit: 1,
      aufgabe: '', antwort: '', tippTexte: [], genutzeTipps: 0,
      aufgabeObj: null,     // full item object from kursinhalt (has tipps + musterloesung)
      musterloesung: '',    // shown after submit in deterministic mode
      ergebnis: null, loading: false,
      scWahl: null,         // selected option key for single_choice (A-E)
      scKorrekt: null,      // boolean result after SC submission
    },
    session: { aufgaben: [] },

    // ── Fortschritt ──────────────────────────────────────────────────────────
    editExamDate: false,

    // ════════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ════════════════════════════════════════════════════════════════════════
    init() {
      const cfg = store.get('api_config') ?? {}
      this.apiKey   = cfg.apiKey ?? ''
      this.apiModel = cfg.model  ?? 'gpt-5.2'
      this.name     = store.get('name') ?? ''
      const raw = store.get('diagnosen') ?? []
      this.diagnosen = raw.filter(d => d.bewertungen?.[0]?.stufe !== undefined)

      const storedExam = store.get('exam_date')
      this.examDateInput = storedExam ? toDateInput(new Date(storedExam)) : toDateInput(dateFromNow(this.kurs.defaultPrüfungstage))

      // Load pre-generated kursinhalt if stored
      const ki = store.get('kursinhalt')
      if (ki?.kurs && ki?.content) {
        this.kursinhalt = ki
        this.kurs = ki.kurs
        this.kursinhaltStatus = { ok: true, msg: `✅ ${ki.kurs.name} (${ki.kurs.themen.length} Themen)` }
        const typen = this.verfügbareTypen()
        if (typen.length) this.ue.typ = typen[0]
      } else {
        // Try auto-loading from ./kursinhalt/ folder (works via Live Server)
        this._tryAutoLoad()
      }

      this._resetAktDiagnose()
      if (this.name) {
        this.screen = 'home'
        this.$nextTick(() => this._renderRadar('radarHome', { compact: true }))
      }
    },

    _persist() {
      store.set('name', this.name)
      store.set('api_config', { apiKey: this.apiKey, model: this.apiModel })
      store.set('exam_date', new Date(this.examDateInput).toISOString())
    },

    // ════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ════════════════════════════════════════════════════════════════════════
    goTo(screen) {
      radar.destroyAll()
      if (screen === 'diagnose') this._resetAktDiagnose()
      this.screen = screen
      this.$nextTick(() => {
        const radarScreens = {
          home:        { id: 'radarHome',         opts: { compact: true } },
          radar:       { id: 'radarCanvas',        opts: { showVerlauf: this.showVerlauf } },
          fortschritt: { id: 'radarFortschritt',   opts: { showVerlauf: this.diagnosen.length > 1 } },
        }
        const cfg = radarScreens[screen]
        if (cfg) this._renderRadar(cfg.id, cfg.opts)
      })
    },

    _renderRadar(canvasId, opts = {}) {
      if (this.diagnosen.length > 0) {
        radar.render(canvasId, this.kurs.themen, this.diagnosen, opts)
      }
    },

    // ════════════════════════════════════════════════════════════════════════
    // SETUP
    // ════════════════════════════════════════════════════════════════════════
    async testApiConnection() {
      if (!this.apiKey) return
      this.apiTest = { status: 'loading', message: '' }
      const result = await testConnection(this.apiKey, this.apiModel)
      this.apiTest = { status: result.ok ? 'ok' : 'error', message: result.message }
    },

    startSolo() {
      if (!this.name.trim()) return
      this._persist()
      this.goTo('home')
    },

    saveSettings() {
      store.set('api_config', { apiKey: this.apiKey, model: this.apiModel })
      this.goTo('home')
    },

    // ════════════════════════════════════════════════════════════════════════
    // KURSINHALT — deterministischer Modus
    // ════════════════════════════════════════════════════════════════════════

    // Auto-load v2: fetch kurs_manifest.json + all thema files from ./kursinhalt/
    async _tryAutoLoad() {
      try {
        const manifestRes = await fetch('./kursinhalt/kurs_manifest.json')
        if (!manifestRes.ok) return
        const manifest = await manifestRes.json()
        if (!manifest.themen?.length) return

        const themaMap = {}
        await Promise.all(manifest.themen.map(async t => {
          try {
            const dateien = t.dateien ?? [t.datei]
            const teile = await Promise.all(dateien.map(async d => {
              const res = await fetch(`./kursinhalt/${d}`)
              return res.ok ? await res.json() : null
            }))
            const valid = teile.filter(Boolean)
            if (valid.length) themaMap[t.id] = this._mergeThemaTeile(valid)
          } catch (_) {}
        }))
        this._applyKursinhaltV2(manifest, themaMap, 'auto')
      } catch (_) {}  // Silently fail — stay in demo mode
    },

    // Merge multiple thema-Teil files into one thema object (concat aufgaben arrays)
    _mergeThemaTeile(teile) {
      if (teile.length === 1) return teile[0]
      const base = JSON.parse(JSON.stringify(teile[0]))
      for (let i = 1; i < teile.length; i++) {
        const src = teile[i].aufgaben
        const dst = base.aufgaben
        for (const [typ, niveaus] of Object.entries(src.doing ?? {})) {
          if (!dst.doing[typ]) dst.doing[typ] = {}
          for (const [n, arr] of Object.entries(niveaus))
            dst.doing[typ][n] = (dst.doing[typ][n] ?? []).concat(arr)
        }
        for (const [typ, niveaus] of Object.entries(src.wissen ?? {})) {
          if (!dst.wissen[typ]) dst.wissen[typ] = {}
          for (const [n, arr] of Object.entries(niveaus))
            dst.wissen[typ][n] = (dst.wissen[typ][n] ?? []).concat(arr)
        }
        for (const [n, arr] of Object.entries(src.verifikation ?? {}))
          dst.verifikation[n] = (dst.verifikation[n] ?? []).concat(arr)
      }
      return base
    },

    _applyKursinhaltV2(manifest, themaMap, source) {
      const ki = {
        kurs: { ...manifest.kurs, themen: manifest.themen },
        aufgabentypen: manifest.aufgabentypen ?? { doing: [], wissen: ['single_choice'] },
        niveaustufen: manifest.niveaustufen ?? { 1: 'Grundlagen', 2: 'Anwendung', 3: 'Klausur', 4: 'Experte' },
        content: themaMap,
      }
      this.kursinhalt = ki
      this.kurs = ki.kurs
      try { store.set('kursinhalt', ki) } catch (_) {}
      const hint = source === 'auto' ? ' (automatisch geladen)' : ''
      this.kursinhaltStatus = { ok: true, msg: `✅ ${ki.kurs.name} — ${manifest.themen.length} Themen${hint}` }
      const typen = this.verfügbareTypen()
      if (typen.length) this.ue.typ = typen[0]
      this._resetAktDiagnose()
    },

    _readJsonFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload  = e => { try { resolve(JSON.parse(e.target.result)) } catch (err) { reject(err) } }
        reader.onerror = reject
        reader.readAsText(file)
      })
    },

    // Upload handler — supports single v1 file OR multiple v2 files (manifest + thema files)
    async loadKursinhaltFile(event) {
      const files = Array.from(event.target.files)
      if (!files.length) return
      this.kursinhaltStatus = { ok: null, msg: 'Lädt…' }

      try {
        const parsed = await Promise.all(files.map(f => this._readJsonFile(f)))

        // Single file: detect v1 (has .content) or v2 manifest (has .themen + .aufgabentypen)
        if (files.length === 1) {
          const data = parsed[0]
          if (data.kurs && data.content) {
            // v1 format
            this.kursinhalt = data
            this.kurs = data.kurs
            try { store.set('kursinhalt', data) } catch (_) {}
            this.kursinhaltStatus = { ok: true, msg: `✅ ${data.kurs.name} — ${data.kurs.themen.length} Themen geladen` }
            this._resetAktDiagnose()
            return
          }
        }

        // v2 multi-file: find manifest and thema files (supports split-Teile per thema)
        let manifest = null
        const themaTeile = {}
        for (const data of parsed) {
          if (data.themen && data.aufgabentypen) {
            manifest = data
          } else if (data.thema_id !== undefined) {
            if (!themaTeile[data.thema_id]) themaTeile[data.thema_id] = []
            themaTeile[data.thema_id].push(data)
          }
        }
        if (!manifest) throw new Error('Keine Manifest-Datei (kurs_manifest.json) gefunden.')
        const themaMap = {}
        for (const [id, teile] of Object.entries(themaTeile))
          themaMap[id] = this._mergeThemaTeile(teile)
        this._applyKursinhaltV2(manifest, themaMap, 'upload')
      } catch (err) {
        this.kursinhaltStatus = { ok: false, msg: `❌ ${err.message}` }
      }
    },

    removeKursinhalt() {
      this.kursinhalt = null
      this.kurs = ACTIVE_KURS
      this.ue.typ = 'erklären'
      localStorage.removeItem(STORAGE_PREFIX + 'kursinhalt')
      this.kursinhaltStatus = { ok: null, msg: '' }
      this._resetAktDiagnose()
    },

    // Pick a random item from the pre-generated pool for a given combination
    _pickFromPool(themaId, typ, schwierigkeit) {
      const thema = this.kursinhalt?.content?.[themaId]
      if (!thema) return null

      // v2 structure: aufgaben.doing.[typ].[level] or aufgaben.wissen.[typ].[level]
      if (thema.aufgaben?.doing || thema.aufgaben?.wissen) {
        const isWissen = this.kursinhalt.aufgabentypen?.wissen?.includes(typ)
        const pool = isWissen
          ? (thema.aufgaben?.wissen?.[typ]?.[schwierigkeit] ?? [])
          : (thema.aufgaben?.doing?.[typ]?.[schwierigkeit] ?? [])
        if (!pool.length) return null
        return pool[Math.floor(Math.random() * pool.length)]
      }

      // v1 fallback: aufgaben.[typ].[level]
      const pool = thema.aufgaben?.[typ]?.[schwierigkeit] ?? []
      if (!pool.length) return null
      return pool[Math.floor(Math.random() * pool.length)]
    },

    // ════════════════════════════════════════════════════════════════════════
    // DIAGNOSE
    // ════════════════════════════════════════════════════════════════════════
    _resetAktDiagnose() {
      this.aktBewertungen = this.kurs.themen.map(t => ({ id: t.id, stufe: null }))
      this.verifikation = { aktiv: false, themaId: null, stufe: null, frage: '', loading: false }
    },

    aktBew(id) {
      return this.aktBewertungen.find(b => b.id === id)?.stufe ?? null
    },

    async setBewertung(id, stufe) {
      const entry = this.aktBewertungen.find(b => b.id === id)
      if (!entry) return
      this.verifikation.aktiv = false
      if (entry.stufe === stufe) { entry.stufe = null; return }
      entry.stufe = stufe
      if (stufe >= 2) await this._startVerifikation(id, stufe)
    },

    async _startVerifikation(id, stufe) {
      const thema = this.kurs.themen.find(t => t.id === id)
      this.verifikation = { aktiv: true, themaId: id, stufe, frage: '', loading: true }

      if (this.kursinhalt) {
        const pool = this.kursinhalt?.content?.[id]?.verifikation?.[stufe] ?? []
        this.verifikation.frage = pool.length
          ? pool[Math.floor(Math.random() * pool.length)]
          : `Erkläre das Kernprinzip von „${thema.name}" in einem Satz.`
        this.verifikation.loading = false
      } else {
        this.verifikation.frage = await callAI(
          PROMPTS.verifizierung(thema.name, stufe),
          'Frage generieren.',
          { apiKey: this.apiKey, model: this.apiModel }
        )
        this.verifikation.loading = false
      }
    },

    confirmVerifikation() { this.verifikation.aktiv = false },
    lowerVerifikation() {
      const e = this.aktBewertungen.find(b => b.id === this.verifikation.themaId)
      if (e?.stufe > 1) e.stufe--
      this.verifikation.aktiv = false
    },

    completeDiagnose() {
      if (!this.diagnoseKomplett || this.verifikation.aktiv) return
      const snap = { datum: new Date().toISOString(), bewertungen: this.aktBewertungen.map(b => ({ ...b })) }
      this.diagnosen.push(snap)
      if (this.diagnosen.length > 5) this.diagnosen.shift()
      store.set('diagnosen', this.diagnosen)
      this.goTo('radar')
    },

    // ════════════════════════════════════════════════════════════════════════
    // RADAR
    // ════════════════════════════════════════════════════════════════════════
    toggleVerlauf() {
      this.showVerlauf = !this.showVerlauf
      this.$nextTick(() => radar.render('radarCanvas', this.kurs.themen, this.diagnosen, { showVerlauf: this.showVerlauf }))
    },

    // ════════════════════════════════════════════════════════════════════════
    // ÜBUNG
    // ════════════════════════════════════════════════════════════════════════
    async generateTask() {
      Object.assign(this.ue, {
        aufgabe: '', antwort: '', tippTexte: [], genutzeTipps: 0,
        ergebnis: null, loading: true, aufgabeObj: null, musterloesung: '',
        scWahl: null, scKorrekt: null,
      })

      if (this.kursinhalt) {
        const item = this._pickFromPool(this.ue.themaId, this.ue.typ, this.ue.schwierigkeit)
        if (item) {
          // SC uses 'frage', doing uses 'aufgabe'
          this.ue.aufgabe    = item.frage ?? item.aufgabe
          this.ue.aufgabeObj = item
        } else {
          this.ue.aufgabe = `Keine Aufgabe für diese Kombination verfügbar. Wähle einen anderen Typ oder Schwierigkeitsgrad.`
        }
        this.ue.loading = false
      } else {
        const thema = this.kurs.themen.find(t => t.id == this.ue.themaId)
        this.ue.aufgabe = await callAI(
          PROMPTS.aufgabe(thema.name, this.ue.typ, this.ue.schwierigkeit),
          'Aufgabe.',
          { apiKey: this.apiKey, model: this.apiModel }
        )
        this.ue.loading = false
      }
      this.screen = 'ueben-aufgabe'
    },

    async requestHint() {
      if (this.ue.genutzeTipps >= 3 || this.ue.loading) return

      if (this.kursinhalt && this.ue.aufgabeObj?.tipps) {
        const tipp = this.ue.aufgabeObj.tipps[this.ue.genutzeTipps] ?? 'Kein weiterer Tipp verfügbar.'
        this.ue.tippTexte.push(tipp)
        this.ue.genutzeTipps++
      } else {
        this.ue.loading = true
        const hint = await callAI(
          PROMPTS.tipp(this.ue.aufgabe, this.ue.genutzeTipps + 1),
          'Tipp.',
          { apiKey: this.apiKey, model: this.apiModel }
        )
        this.ue.tippTexte.push(hint)
        this.ue.genutzeTipps++
        this.ue.loading = false
      }
    },

    async submitAnswer() {
      if (this.ue.loading) return

      if (this.kursinhalt && this.ue.aufgabeObj) {
        if (this.isSingleChoice) {
          // Single choice: auto-evaluate, no self-assessment needed
          if (!this.ue.scWahl) return
          this.ue.scKorrekt = this.ue.scWahl === this.ue.aufgabeObj.korrekt
          this.ue.musterloesung = this.ue.aufgabeObj.erklaerung ?? ''
          this.ue.ergebnis = '__musterloesung__'
          this._applyAdaptivity(this.ue.scKorrekt)
          this.screen = 'ueben-ergebnis'
        } else {
          // Doing: show model answer, student self-assesses
          this.ue.musterloesung = this.ue.aufgabeObj.musterloesung
          this.ue.ergebnis = '__musterloesung__'
          this.screen = 'ueben-ergebnis'
        }
      } else {
        // AI mode: get feedback from LLM
        if (!this.ue.antwort.trim()) return
        this.ue.loading = true
        const thema = this.kurs.themen.find(t => t.id == this.ue.themaId)
        this.ue.ergebnis = await callAI(
          PROMPTS.bewertung(this.ue.aufgabe, this.ue.antwort, thema.name),
          'Bewerten.',
          { apiKey: this.apiKey, model: this.apiModel }
        )
        this.ue.loading = false
        const korrekt = this._estimateCorrectness(this.ue.ergebnis)
        this._applyAdaptivity(korrekt)
        this.screen = 'ueben-ergebnis'
      }
    },

    // Called from HTML when student self-assesses after seeing model answer
    selfAssess(korrekt) {
      this._applyAdaptivity(korrekt)
    },

    _applyAdaptivity(korrekt) {
      const { genutzeTipps } = this.ue
      if (korrekt && genutzeTipps === 0)      this.ue.schwierigkeit = Math.min(4, this.ue.schwierigkeit + 1)
      else if (!korrekt || genutzeTipps >= 2)  this.ue.schwierigkeit = Math.max(1, this.ue.schwierigkeit - 1)
      this.session.aufgaben.push({ korrekt, tipps: genutzeTipps })
    },

    _estimateCorrectness(fb) {
      const l = fb.toLowerCase()
      return !l.includes('fehlt') && !l.includes('falsch') && !l.includes('nicht korrekt') && !l.includes('unvollständig')
    },

    nextTask() {
      Object.assign(this.ue, { aufgabe: '', antwort: '', tippTexte: [], genutzeTipps: 0, ergebnis: null, aufgabeObj: null, musterloesung: '', scWahl: null, scKorrekt: null })
      this.screen = 'ueben-auswahl'
    },

    // ════════════════════════════════════════════════════════════════════════
    // FORTSCHRITT
    // ════════════════════════════════════════════════════════════════════════
    updateExamDate() {
      store.set('exam_date', new Date(this.examDateInput).toISOString())
      this.editExamDate = false
    },

    resetAll() {
      if (confirm('Alle Lernkreis-Daten löschen? Nicht rückgängig machbar.')) {
        store.clearAll(); location.reload()
      }
    },

    // ════════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ════════════════════════════════════════════════════════════════════════
    get letzeDiagnose()    { return this.diagnosen.at(-1) ?? null },
    get diagnoseKomplett() { return this.aktBewertungen.every(b => b.stufe !== null) },
    get bewerteteThemen()  { return this.aktBewertungen.filter(b => b.stufe !== null).length },
    get verbleibeneTage()  { return Math.max(0, Math.ceil((new Date(this.examDateInput) - new Date()) / 86400000)) },
    get zeitProzent()      { return Math.min(100, Math.round((1 - this.verbleibeneTage / 90) * 100)) },
    get hasDeterministicContent() { return !!this.kursinhalt },
    get isMusterloesung()  { return this.ue.ergebnis === '__musterloesung__' },
    get isSingleChoice()   { return this.ue.typ === 'single_choice' },

    // Available task types: from manifest (v2) or fallback for AI/v1 mode
    verfügbareTypen() {
      if (this.kursinhalt?.aufgabentypen) {
        const { doing = [], wissen = [] } = this.kursinhalt.aufgabentypen
        return [...doing, ...wissen]
      }
      return ['erklären', 'fehler']
    },

    themenBereit() { return this.letzeDiagnose?.bewertungen.filter(b => b.stufe >= 4).length ?? 0 },

    schwächsteThemen() {
      if (!this.letzeDiagnose) return []
      return this.kurs.themen
        .map(t => ({ ...t, stufe: this.letzeDiagnose.bewertungen.find(b => b.id === t.id)?.stufe ?? null }))
        .filter(t => (t.stufe ?? 0) <= 3)
        .sort((a, b) => (a.stufe ?? 0) - (b.stufe ?? 0))
        .slice(0, 3)
    },

    verbesserungen() {
      if (this.diagnosen.length < 2) return []
      const [prev, curr] = this.diagnosen.slice(-2)
      return this.kurs.themen.filter(t => {
        const ps = prev.bewertungen.find(b => b.id === t.id)?.stufe ?? 0
        const cs = curr.bewertungen.find(b => b.id === t.id)?.stufe ?? 0
        return cs > ps
      })
    },

    themenMitStatus() {
      return this.kurs.themen
        .map(t => ({ ...t, stufe: this.letzeDiagnose?.bewertungen.find(b => b.id === t.id)?.stufe ?? null }))
        .sort((a, b) => (a.stufe ?? 0) - (b.stufe ?? 0))
    },

    diagnosePunkte() {
      return this.diagnosen.map((d, i) => ({ idx: i, datum: this.fmt(d.datum) }))
    },

    sessionSummaryNeeded() { return this.session.aufgaben.length > 0 && this.session.aufgaben.length % 5 === 0 },

    // ════════════════════════════════════════════════════════════════════════
    // FORMATTERS
    // ════════════════════════════════════════════════════════════════════════
    stufenCfg: s  => STUFEN[s] ?? { label: '—', color: '#7A6E8A', bg: '#F3F4F6' },
    starStr:   s  => s ? '★'.repeat(s) + '☆'.repeat(5 - s) : '☆☆☆☆☆',
    fmt:       iso => new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    examFmt:   () => new Date(this.examDateInput).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }),
    todayMin:  () => todayInput(),
    themenName: id => this.kurs.themen.find(t => t.id == id)?.name ?? '',
    diffStr:   lvl => '●'.repeat(lvl) + '○'.repeat(4 - lvl),
    kompScore: () => 100 - this.ue.genutzeTipps * 20,
    typLabel:  typ => {
      const labels = {
        'erklären': 'Erklären', 'fehler': 'Fehler finden', 'berechnen': 'Berechnen',
        'herleiten': 'Herleiten', 'skizzieren': 'Skizzieren', 'modellieren': 'Modellieren',
        'analysieren': 'Analysieren', 'interpretieren': 'Interpretieren',
        'single_choice': 'Wissenstest',
      }
      return labels[typ] ?? (typ.charAt(0).toUpperCase() + typ.slice(1))
    },
    niveauLabel: lvl => {
      if (this.kursinhalt?.niveaustufen) return this.kursinhalt.niveaustufen[lvl] ?? lvl
      return ['', 'Grundlagen', 'Anwendung', 'Klausur', 'Experte'][lvl] ?? lvl
    },
  }
}
