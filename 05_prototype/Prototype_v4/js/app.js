/**
 * Mias Lernkreis — Solo App v4
 * Alpine.js state & methods
 * Depends on: config.js, api.js, radar.js
 */

// ─── Storage helpers ───────────────────────────────────────────────────────────
const store = {
  get:      key    => JSON.parse(localStorage.getItem(STORAGE_PREFIX + key) ?? 'null'),
  set:      (k, v) => localStorage.setItem(STORAGE_PREFIX + k, JSON.stringify(v)),
  clearAll: ()     => Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX)).forEach(k => localStorage.removeItem(k)),
}

// ─── Date helpers ──────────────────────────────────────────────────────────────
const dateFromNow = days => { const d = new Date(); d.setDate(d.getDate() + days); return d }
const toDateInput = date => (date instanceof Date ? date : new Date(date)).toISOString().split('T')[0]
const todayInput  = () => toDateInput(new Date())

// ─── Alpine App ────────────────────────────────────────────────────────────────
function app() {
  return {

    // ── Screen ────────────────────────────────────────────────────────────────
    screen: 'setup',

    // ── Setup ─────────────────────────────────────────────────────────────────
    name: '',
    apiKey: '',
    apiModel: 'gpt-5.2',
    examDateInput: toDateInput(dateFromNow(45)),
    apiTest: { status: null, message: '' },

    // ── Kurs ──────────────────────────────────────────────────────────────────
    kurs: ACTIVE_KURS,

    // ── Kursinhalt (deterministischer Modus) ──────────────────────────────────
    kursinhalt: null,
    kursinhaltStatus: { ok: null, msg: '' },
    _aufgabenCache: {},

    // ── Diagnose ──────────────────────────────────────────────────────────────
    // v4 format: [{ datum: ISO, scores: [{id, score: 0–100}] }]
    diagnosen: [],
    aktBewertungen: [],
    verifikation: { aktiv: false, themaId: null, stufe: null, frage: '', musterloesung: '', showMusterloesung: false, loading: false },

    // ── Live Scores (updated by each task result, base = last diagnosis) ──────
    liveScores: {},  // { [themaId]: score | null }

    // ── Radar ─────────────────────────────────────────────────────────────────
    showVerlauf: false,
    radarPulse: false,

    // ── Übung ─────────────────────────────────────────────────────────────────
    ue: {
      themaId: 1, typ: 'erklären', schwierigkeit: 1,
      aufgabe: '', antwort: '', tippTexte: [], genutzeTipps: 0,
      aufgabeObj: null, musterloesung: '',
      ergebnis: null, loading: false,
      scWahl: null, scKorrekt: null,
      taskReady: false, resultReady: false,
    },
    session: { aufgaben: [] },
    heuteGeuebt: 0,   // persistent: alle Lernaktivitäten heute (Üben + Verifikation)

    // ── Fortschritt ───────────────────────────────────────────────────────────
    editName: false,
    editExamDate: false,
    editCountdown: false,
    zeitProzentAnimated: 0,
    lernProzentAnimated: 0,

    // ════════════════════════════════════════════════════════════════════════
    // LIFECYCLE
    // ════════════════════════════════════════════════════════════════════════
    init() {
      const cfg = store.get('api_config') ?? {}
      this.apiKey   = cfg.apiKey ?? ''
      this.apiModel = cfg.model  ?? 'gpt-5.2'
      this.name     = store.get('name') ?? ''

      // Load & migrate diagnosen (v3 format: bewertungen → v4 format: scores)
      const raw = store.get('diagnosen') ?? []
      this.diagnosen = raw.map(d => {
        if (d.scores) return d
        return {
          datum: d.datum,
          scores: (d.bewertungen ?? []).map(b => ({
            id: b.id,
            score: STUFE_TO_SCORE[b.stufe] ?? 0,
          })),
        }
      })

      const storedExam = store.get('exam_date')
      this.examDateInput = storedExam
        ? toDateInput(new Date(storedExam))
        : toDateInput(dateFromNow(this.kurs.defaultPrüfungstage))

      // Restore today's activity counter (resets if it's a new day)
      const todayLog = store.get('heute_log')
      this.heuteGeuebt = (todayLog?.date === todayInput()) ? (todayLog.count ?? 0) : 0

      this._initLiveScores()
      this._tryAutoLoad()
      this._resetAktDiagnose()
      this.$nextTick(() => setTimeout(() => this._animateProgress(), 120))

      if (this.name) {
        this.screen = 'home'
        this.$nextTick(() => {
          if (this.hasDiagnose) this._renderRadar('radarHome', {})
        })
      }
    },

    _persist() {
      store.set('name', this.name)
      store.set('api_config', { apiKey: this.apiKey, model: this.apiModel })
      store.set('exam_date', new Date(this.examDateInput).toISOString())
    },

    // ════════════════════════════════════════════════════════════════════════
    // LIVE SCORES
    // ════════════════════════════════════════════════════════════════════════
    _initLiveScores() {
      const last = this.diagnosen.at(-1) ?? null
      const scores = {}
      this.kurs.themen.forEach(t => {
        scores[t.id] = last ? (last.scores?.find(b => b.id === t.id)?.score ?? 0) : null
      })
      this.liveScores = scores
    },

    _updateLiveRadar() {
      if (!this.hasDiagnose) return
      const snap = {
        datum: new Date().toISOString(),
        scores: this.kurs.themen.map(t => ({ id: t.id, score: this.liveScores[t.id] ?? 0 })),
      }
      this.$nextTick(() => radar.render('radarHome', this.kurs.themen, [snap], {}))
    },

    // ════════════════════════════════════════════════════════════════════════
    // NAVIGATION
    // ════════════════════════════════════════════════════════════════════════
    goTo(screen) {
      // Radar pulse + progress bar animation when returning home after a practice session
      if (screen === 'home' && this.screen === 'ueben' && this.session.aufgaben.length > 0) {
        this.radarPulse = false
        this.zeitProzentAnimated = 0
        this.lernProzentAnimated = 0
        setTimeout(() => {
          this.radarPulse = true
          this._animateProgress()
          setTimeout(() => { this.radarPulse = false }, 1000)
        }, 300)
      }

      if (screen === 'diagnose') this._resetAktDiagnose()
      this.screen = screen

      this.$nextTick(() => {
        if (screen === 'home' && this.hasDiagnose) {
          this._renderRadar('radarHome', {})
        } else if (screen === 'fortschritt' && this.hasDiagnose) {
          this._renderRadar('radarFortschritt', { showVerlauf: this.diagnosen.length > 1 })
        }
      })
    },

    _renderRadar(canvasId, opts = {}) {
      if (!this.hasDiagnose) return
      if (canvasId === 'radarHome') {
        // Home shows live scores; verlauf shows saved diagnoses
        const snaps = this.showVerlauf
          ? this.diagnosen
          : [{
              datum: new Date().toISOString(),
              scores: this.kurs.themen.map(t => ({ id: t.id, score: this.liveScores[t.id] ?? 0 })),
            }]
        radar.render(canvasId, this.kurs.themen, snaps, { ...opts, showVerlauf: this.showVerlauf && this.diagnosen.length > 1 })
      } else {
        radar.render(canvasId, this.kurs.themen, this.diagnosen, opts)
      }
    },

    toggleVerlauf() {
      this.showVerlauf = !this.showVerlauf
      this.$nextTick(() => {
        if (this.screen === 'home') this._renderRadar('radarHome', {})
        else if (this.screen === 'fortschritt') this._renderRadar('radarFortschritt', { showVerlauf: this.showVerlauf })
      })
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
    async _tryAutoLoad() {
      try {
        const manifestRes = await fetch('./kursinhalt/kurs_manifest.json')
        if (!manifestRes.ok) return
        const manifest = await manifestRes.json()
        if (!manifest.themen?.length) return

        const metaMap = {}
        await Promise.all(manifest.themen.map(async t => {
          try {
            const ordner = t.ordner ?? `thema_${t.id}`
            const res = await fetch(`./kursinhalt/${ordner}/verifikation.json`)
            if (res.ok) metaMap[t.id] = await res.json()
          } catch (_) {}
        }))

        this._applyKursinhaltV3(manifest, metaMap)
      } catch (_) {}
    },

    _applyKursinhaltV3(manifest, metaMap) {
      const ki = {
        kurs: { ...manifest.kurs, themen: manifest.themen },
        niveaustufen: manifest.niveaustufen ?? { 1: 'Grundlagen', 2: 'Anwendung', 3: 'Klausur', 4: 'Experte' },
        verifikation: metaMap,
      }
      this.kursinhalt = ki
      this.kurs = ki.kurs
      this.kursinhaltStatus = { ok: true, msg: `✅ ${ki.kurs.name} — ${manifest.themen.length} Themen (automatisch geladen)` }
      const typen = this.verfügbareTypen()
      if (typen.length) this.ue.typ = typen[0]
      this._resetAktDiagnose()
      this._initLiveScores()
    },

    async _loadNiveauFile(ordner, fragentyp, niveau) {
      const key = `${ordner}/${fragentyp}/niveau_${niveau}`
      if (this._aufgabenCache[key] !== undefined) return this._aufgabenCache[key]
      try {
        const res = await fetch(`./kursinhalt/${key}.json`)
        const data = res.ok ? await res.json() : []
        this._aufgabenCache[key] = Array.isArray(data) ? data : []
      } catch (_) {
        this._aufgabenCache[key] = []
      }
      return this._aufgabenCache[key]
    },

    removeKursinhalt() {
      this.kursinhalt = null
      this.kurs = ACTIVE_KURS
      this.ue.typ = 'erklären'
      this._aufgabenCache = {}
      this.kursinhaltStatus = { ok: null, msg: '' }
      this._resetAktDiagnose()
      this._initLiveScores()
    },

    async _pickFromPool(themaId, typ, schwierigkeit) {
      const thema = this.kurs.themen.find(t => t.id == themaId)
      if (!thema) return null
      const ordner = thema.ordner ?? `thema_${themaId}`
      const pool = await this._loadNiveauFile(ordner, typ, schwierigkeit)
      if (!pool.length) return null
      return pool[Math.floor(Math.random() * pool.length)]
    },

    // ════════════════════════════════════════════════════════════════════════
    // DIAGNOSE
    // ════════════════════════════════════════════════════════════════════════
    _resetAktDiagnose() {
      this.aktBewertungen = this.kurs.themen.map(t => ({ id: t.id, stufe: null }))
      this.verifikation = { aktiv: false, themaId: null, stufe: null, frage: '', musterloesung: '', showMusterloesung: false, loading: false }
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
      this.verifikation = { aktiv: true, themaId: id, stufe, frage: '', musterloesung: '', showMusterloesung: false, loading: true }

      if (this.kursinhalt) {
        const pool = this.kursinhalt?.verifikation?.[id]?.[stufe] ?? []
        const raw = pool.length
          ? pool[Math.floor(Math.random() * pool.length)]
          : `Erkläre das Kernprinzip von „${thema.name}" in einem Satz.`
        if (typeof raw === 'object') {
          this.verifikation.frage         = raw.frage ?? ''
          this.verifikation.musterloesung = raw.musterloesung ?? ''
        } else {
          this.verifikation.frage         = raw
          this.verifikation.musterloesung = ''
        }
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

    confirmVerifikation() {
      this._countActivity()
      this.verifikation.aktiv = false
    },
    lowerVerifikation() {
      const e = this.aktBewertungen.find(b => b.id === this.verifikation.themaId)
      if (e?.stufe > 1) e.stufe--
      this._countActivity()
      this.verifikation.aktiv = false
    },

    completeDiagnose() {
      if (!this.diagnoseKomplett || this.verifikation.aktiv) return
      const snap = {
        datum: new Date().toISOString(),
        scores: this.aktBewertungen.map(b => ({
          id: b.id,
          score: STUFE_TO_SCORE[b.stufe] ?? 0,
        })),
      }
      this.diagnosen.push(snap)
      if (this.diagnosen.length > 5) this.diagnosen.shift()
      store.set('diagnosen', this.diagnosen)

      // New diagnosis sets the base for live scores
      this.kurs.themen.forEach(t => {
        this.liveScores[t.id] = snap.scores.find(b => b.id === t.id)?.score ?? 0
      })

      this.goTo('home')
    },

    // ════════════════════════════════════════════════════════════════════════
    // ÜBUNG
    // ════════════════════════════════════════════════════════════════════════
    async generateTask() {
      Object.assign(this.ue, {
        aufgabe: '', antwort: '', tippTexte: [], genutzeTipps: 0,
        ergebnis: null, loading: true, aufgabeObj: null, musterloesung: '',
        scWahl: null, scKorrekt: null,
        resultReady: false,
      })

      if (this.kursinhalt) {
        const item = await this._pickFromPool(this.ue.themaId, this.ue.typ, this.ue.schwierigkeit)
        if (item) {
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
      this.ue.taskReady = true
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
          if (!this.ue.scWahl) return
          this.ue.scKorrekt    = this.ue.scWahl === this.ue.aufgabeObj.korrekt
          this.ue.musterloesung = this.ue.aufgabeObj.erklaerung ?? ''
          this.ue.ergebnis     = '__musterloesung__'
          this._applyTaskResult(this.ue.scKorrekt)
        } else {
          // Doing: show model answer, student self-assesses
          this.ue.musterloesung = this.ue.aufgabeObj.musterloesung
          this.ue.ergebnis     = '__musterloesung__'
          // _applyTaskResult called later in selfAssess()
        }
      } else {
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
        this._applyTaskResult(korrekt)
      }
      this.ue.resultReady = true
    },

    selfAssess(korrekt) {
      this._applyTaskResult(korrekt)
      this.clearTask()
    },

    clearTask() {
      Object.assign(this.ue, {
        aufgabe: '', antwort: '', tippTexte: [], genutzeTipps: 0,
        ergebnis: null, aufgabeObj: null, musterloesung: '',
        scWahl: null, scKorrekt: null,
        taskReady: false, resultReady: false, loading: false,
      })
    },

    _countActivity() {
      this.heuteGeuebt++
      store.set('heute_log', { date: todayInput(), count: this.heuteGeuebt })
    },

    _applyTaskResult(korrekt) {
      const { genutzeTipps, themaId } = this.ue
      const currentScore = this.liveScores[themaId] ?? 0

      const delta = korrekt
        ? [SCORE_DELTA.correct_0tips, SCORE_DELTA.correct_1tip, SCORE_DELTA.correct_2tips, SCORE_DELTA.correct_3tips][Math.min(genutzeTipps, 3)]
        : SCORE_DELTA.wrong

      this.liveScores[themaId] = Math.max(0, Math.min(100, currentScore + delta))

      // Adaptive difficulty
      if (korrekt && genutzeTipps === 0)     this.ue.schwierigkeit = Math.min(4, this.ue.schwierigkeit + 1)
      else if (!korrekt || genutzeTipps >= 2) this.ue.schwierigkeit = Math.max(1, this.ue.schwierigkeit - 1)

      this.session.aufgaben.push({ korrekt, tipps: genutzeTipps, themaId })
      this._countActivity()
      this._updateLiveRadar()
    },

    _estimateCorrectness(fb) {
      const l = fb.toLowerCase()
      return !l.includes('fehlt') && !l.includes('falsch') && !l.includes('nicht korrekt') && !l.includes('unvollständig')
    },

    // ════════════════════════════════════════════════════════════════════════
    // FORTSCHRITT
    // ════════════════════════════════════════════════════════════════════════
    updateExamDate() {
      store.set('exam_date', new Date(this.examDateInput).toISOString())
      this.editExamDate = false
      this._animateProgress()
    },

    saveName() {
      const trimmed = (this.name || '').trim()
      if (!trimmed) return
      this.name = trimmed
      this._persist()
      this.editName = false
    },

    saveCountdownDate() {
      store.set('exam_date', new Date(this.examDateInput).toISOString())
      this.editCountdown = false
      this._animateProgress()
    },

    _animateProgress() {
      this.zeitProzentAnimated = 0
      this.lernProzentAnimated = 0
      this.$nextTick(() => setTimeout(() => {
        this.zeitProzentAnimated = this.zeitProzent
        this.lernProzentAnimated = this.lernProzent
      }, 50))
    },

    resetAll() {
      if (confirm('Alle Lernkreis-Daten löschen? Nicht rückgängig machbar.')) {
        store.clearAll(); location.reload()
      }
    },

    // ════════════════════════════════════════════════════════════════════════
    // COMPUTED
    // ════════════════════════════════════════════════════════════════════════
    get hasDiagnose()      { return this.diagnosen.length > 0 },
    get letzeDiagnose()    { return this.diagnosen.at(-1) ?? null },
    get diagnoseKomplett() { return this.aktBewertungen.every(b => b.stufe !== null) },
    get bewerteteThemen()  { return this.aktBewertungen.filter(b => b.stufe !== null).length },
    get verbleibeneTage()  { return Math.max(0, Math.ceil((new Date(this.examDateInput) - new Date()) / 86400000)) },
    get zeitProzent() {
      if (!this.diagnosen.length) return 0
      const start  = new Date(this.diagnosen[0].datum)
      const exam   = new Date(this.examDateInput)
      const total  = exam - start
      if (total <= 0) return 100
      return Math.min(100, Math.max(0, Math.round(((new Date() - start) / total) * 100)))
    },
    get lernstartDatum() {
      if (!this.diagnosen.length) return null
      return new Date(this.diagnosen[0].datum)
    },

    // Baseline scores from first diagnosis — the "0% point"
    get lernBasis() {
      if (!this.diagnosen.length) return null
      const first = this.diagnosen[0]
      const basis = {}
      this.kurs.themen.forEach(t => {
        basis[t.id] = first.scores?.find(s => s.id === t.id)?.score ?? 0
      })
      return basis
    },

    // Relative progress: 0% = first diagnosis, 100% = all themes at Klausurniveau
    get lernProzent() {
      if (!this.hasDiagnose || !this.lernBasis) return 0
      const themen = this.kurs.themen
      if (!themen.length) return 0
      let total = 0
      themen.forEach(t => {
        const baseline = this.lernBasis[t.id] ?? 0
        const current  = this.liveScores[t.id] ?? baseline
        const gap = KLAUSUR_SCORE - baseline
        if (gap <= 0) {
          total += 100  // already at/above Klausurniveau at baseline
        } else {
          total += Math.max(0, Math.min(100, Math.round((current - baseline) / gap * 100)))
        }
      })
      return Math.round(total / themen.length)
    },
    get hasDeterministicContent() { return !!this.kursinhalt },
    get isMusterloesung()  { return this.ue.ergebnis === '__musterloesung__' },
    get isSingleChoice()   { return this.ue.typ === 'single_choice' },

    get screenTitle() {
      const map = {
        home:          `Hallo, ${this.name} 👋`,
        diagnose:      'Selbstdiagnose',
        ueben:         'Üben',
        fortschritt:   'Fortschritt',
        einstellungen: 'Einstellungen',
      }
      return map[this.screen] ?? ''
    },

    countdownClass() {
      if (this.verbleibeneTage > 20) return 'countdown-chip--ok'
      if (this.verbleibeneTage > 7)  return 'countdown-chip--warn'
      return 'countdown-chip--urgent'
    },

    themenBereit() {
      return this.kurs.themen.filter(t => (this.liveScores[t.id] ?? 0) >= KLAUSUR_SCORE).length
    },

    schwächsteThemen() {
      if (!this.hasDiagnose) return []
      return this.kurs.themen
        .map(t => ({ ...t, score: this.liveScores[t.id] ?? 0 }))
        .filter(t => t.score < KLAUSUR_SCORE)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)
    },

    verbesserungen() {
      if (this.diagnosen.length < 2) return []
      const [prev, curr] = this.diagnosen.slice(-2)
      return this.kurs.themen.filter(t => {
        const ps = prev.scores?.find(b => b.id === t.id)?.score ?? 0
        const cs = curr.scores?.find(b => b.id === t.id)?.score ?? 0
        return cs > ps
      })
    },

    themenMitStatus() {
      return this.kurs.themen
        .map(t => ({ ...t, score: this.liveScores[t.id] ?? null }))
        .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    },

    diagnosePunkte() {
      return this.diagnosen.map((d, i) => ({ idx: i, datum: this.fmt(d.datum) }))
    },

    verfügbareTypen(themaId) {
      const id = themaId ?? this.ue.themaId
      const thema = this.kurs.themen?.find(t => t.id == id)
      if (thema?.fragentypen) return thema.fragentypen
      return ['erklären', 'fehler']
    },

    radarDatum() {
      if (!this.letzeDiagnose) return ''
      return new Date(this.letzeDiagnose.datum).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })
    },

    // ════════════════════════════════════════════════════════════════════════
    // FORMATTERS
    // ════════════════════════════════════════════════════════════════════════
    scoreConfig: s  => scoreConfig(s),
    stufenCfg:   s  => STUFEN[s] ?? { label: '—', color: '#7A6E8A', bg: '#F3F4F6' },
    fmt:         iso => new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }),
    examFmt()         { return new Date(this.examDateInput).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' }) },
    todayMin:    ()  => todayInput(),
    themenName:  id  => this.kurs.themen.find(t => t.id == id)?.name ?? '',
    diffStr:     lvl => '●'.repeat(lvl) + '○'.repeat(4 - lvl),
    kompScore:   ()  => 100 - this.ue.genutzeTipps * 20,
    shortName:   n   => n.split(' — ')[1] ?? n,
    typLabel:    typ => {
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
