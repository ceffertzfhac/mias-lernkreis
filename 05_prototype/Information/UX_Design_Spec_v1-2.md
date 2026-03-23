# UX/UI Design Specification — Mias Lernkreis Solo
**Version:** 1.0  
**Basis:** Prototyp v3.1 (index.html / styles.css / app.js)  
**Erstellt von:** Robin, Senior UX/UI Designer, DTConsulting  
**Zielgruppe:** Dev Team DTConsulting  
**Plattform:** Desktop-first Web (1280px Basis), VS Code / Live Server

---

## 0. Scope & Prinzipien

Dieses Dokument beschreibt **ausschließlich UX- und UI-Änderungen** gegenüber Prototyp v3.1.  
Logik, Datenmodell und Alpine.js-Struktur werden **nicht verändert**, sofern nicht explizit angegeben.

### Drei Leitprinzipien dieser Überarbeitung

**1. Desktop-first statt mobile-first**  
Der primäre Nutzungskontext ist ein Laptop. Das Layout muss bei 1280px nativ funktionieren — nicht als Hochskalierung eines 440px-Designs.

**2. Kontinuität statt Stufen**  
Lernfortschritt ist ein fließender Prozess. Alle Visualisierungen müssen weiche Übergänge zeigen, keine abrupten Sprünge.

**3. Fokus statt Überladung**  
Jeder Screen hat eine primäre Aktion. Alles andere ist sekundär und wird entsprechend visuell zurückgestuft.

---

## 1. Design Tokens — Referenz (unverändert gegenüber v3.1)

Das bestehende Token-System in `styles.css` bleibt vollständig erhalten.  
Alle neuen CSS-Regeln verwenden ausschließlich diese Variablen.

```css
--c-primary:     #4A2C6E
--c-accent:      #7B4FA6
--c-bg:          #F6F4FA
--c-surface:     #FFFFFF
--c-light:       #EDE6F5
--c-ink:         #1C1828
--c-muted:       #7A6E8A
--c-success:     #1A5C3A   --c-success-bg: #D1FAE5
--c-warn:        #7A4A00   --c-warn-bg:    #FEF3C7
--c-error:       #8B1A1A   --c-error-bg:   #FEE2E2
--c-amber:       #A16207   --c-amber-bg:   #FEF9C3
```

**Neue Tokens hinzufügen:**
```css
--sidebar-w:   200px      /* Sidebar-Breite — war 88px */
--header-h:    56px       /* Topbar-Höhe */
```

---

## 2. Globales Layout — App Shell

### 2.1 Aktueller Zustand (v3.1)

```css
.app-shell {
  max-width: 440px;      /* ← Problem: Mobile-Denken */
  margin-inline: auto;
}
```

Die 440px-Begrenzung lässt auf 1280px einen leeren Bildschirm entstehen.  
Responsive Breakpoints bei 768px und 1100px sind nachträgliche Patches, kein echtes Desktop-Design.

### 2.2 Neue Anforderung

```
┌─────────────────────────────────────────────────────────────┐
│  SIDEBAR (200px, fest)  │  MAIN AREA (flex: 1)              │
│                         │  ┌─────────────────────────────┐  │
│  [Brand]                │  │ TOPBAR (56px, fest)         │  │
│  [Nav: Radar]           │  └─────────────────────────────┘  │
│  [Nav: Diagnose]        │  ┌─────────────────────────────┐  │
│  [Nav: Üben]            │  │ SCREEN CONTENT (flex: 1,    │  │
│  [Nav: Fortschritt]     │  │ overflow-y: auto)           │  │
│  ───────────────────    │  │                             │  │
│  [Nav: Einstellungen]   │  │                             │  │
└─────────────────────────│  └─────────────────────────────┘  │
                          └─────────────────────────────────────┘
```

**CSS-Anforderung:**
```css
/* Entfernen: */
.app-shell { max-width: 440px; }

/* Ersetzen durch: */
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  height: 100vh;
  overflow: hidden;
}

html, body {
  height: 100%;
  overflow: hidden;    /* Kein globales Scrollen — Scrollen nur in .screen-content */
}
```

---

## 3. Sidebar Navigation

### 3.1 Aktueller Zustand (v3.1)

- `.nav-bar`: fixiert am Bottom (mobile) / 88px breite Sidebar (desktop)
- 3 Items: Radar, Üben, Mehr (← "Mehr" ist kein Navigationsziel)
- Icons ohne Labels auf kleinen Breakpoints
- `backdrop-filter: blur(14px)` — unnötiger Effekt

### 3.2 Neue Anforderung

**Struktur:**
```
┌──────────────────┐
│  [●] ML          │  ← Brand: Icon (36×36px, border-radius 10px, bg: --c-primary)
│  Mias Lernkreis  │    + Name (13px, 700) + Kursname (11px, --c-muted)
│  Physik · FH Aa. │
├──────────────────┤
│  ◈  Radar        │  ← Nav Item (aktiv)
│  ✓  Diagnose     │
│  ✏  Üben         │
│  ▪  Fortschritt  │
│                  │
│  [flex: 1 gap]   │
│                  │
├──────────────────┤
│  ⚙  Einstellungen│  ← Footer-Bereich, visuell separiert
└──────────────────┘
```

**Maße & Abstände:**
- Sidebar-Breite: `200px` (CSS Variable `--sidebar-w`)
- Hintergrund: `--c-surface` (#FFFFFF)
- Rechter Rand: `1px solid --c-light`
- Innenabstand: `24px 16px 20px`
- Brand-Bereich: `padding-bottom: 20px; border-bottom: 1px solid --c-light; margin-bottom: 8px`

**Nav Item Spezifikation:**
```
Größe:          width: 100%; padding: 10px 12px
Radius:         10px
Icon:           18×18px SVG, stroke: currentColor, fill: none, stroke-width: 2
Icon-Gap:       10px zwischen Icon und Label
Label:          font-size: 14px, font-weight: 500
Farbe normal:   --c-muted
Farbe aktiv:    --c-primary, font-weight: 700, background: --c-light
Hover:          background: --c-light, color: --c-primary
Transition:     background 0.1s, color 0.1s
```

**Nav Items (4 primär + 1 footer):**

| Label | Icon | Screen |
|---|---|---|
| Radar | Sechseck mit Linien (bestehend aus v3.1) | home |
| Diagnose | Checkbox mit Haken | diagnose |
| Üben | Stift/Edit | ueben |
| Fortschritt | Balkendiagramm | fortschritt |
| Einstellungen | Zahnrad | einstellungen |

> **Wichtig:** "Mehr" wird vollständig entfernt. Fortschritt und Einstellungen erhalten eigene Nav-Items.

**Kein** `backdrop-filter`, kein `box-shadow`, kein `blur`.

---

## 4. Topbar

### 4.1 Aktueller Zustand (v3.1)

Nicht vorhanden — Kontext-Info steht in `.screen-header` auf jedem Screen separat.

### 4.2 Neue Anforderung

Eine persistente Topbar über dem Screen-Content auf allen Screens außer Setup.

```
┌─────────────────────────────────────────────────────────────┐
│  [Screen-Titel, 15px 700]        [Countdown-Chip]          │
│  [Kursname, 12px --c-muted]                                 │
└─────────────────────────────────────────────────────────────┘
```

**Spezifikation:**
- Höhe: `56px` (CSS Variable `--header-h`)
- Hintergrund: `--c-surface`
- Unterer Rand: `1px solid --c-light`
- Padding: `0 28px`
- Flexbox: `justify-content: space-between; align-items: center`

**Screen-Titel** (x-text via Alpine, je nach aktuellem Screen):
- `home` → `Hallo, [name] 👋`
- `diagnose` → `Selbstdiagnose`
- `ueben` → `Üben`
- `fortschritt` → `Fortschritt`
- `einstellungen` → `Einstellungen`

**Countdown-Chip:**
```
Padding:        6px 14px
Border-radius:  999px
Font-size:      13px, font-weight: 600
Icon:           ⏱ (text)
Format:         "[N] Tage bis Klausur"

Farben (dynamisch per Alpine :class):
  > 20 Tage:   background --c-success-bg, color --c-success
  7–20 Tage:   background --c-warn-bg,    color --c-warn
  < 7 Tage:    background --c-error-bg,   color --c-error
```

---

## 5. Setup Screen

### 5.1 Aktueller Zustand (v3.1)

- Volle Seite mit Sidebar-Platzhalter und API-Config-Bereich (collapsible)
- Sidebar wird auf dem Setup-Screen gezeigt
- 5 Eingabefelder

### 5.2 Neue Anforderung

Setup ist ein Sonderfall: **keine Sidebar**, **keine Topbar**. Zentrierte Card auf `--c-bg`.

**Layout:**
```
Vollbild: display flex, align-items center, justify-content center
Card: max-width 480px, padding 40px 44px, border-radius 20px
      background --c-surface, border 1px solid --c-light
```

**Felder (nur diese 3, keine API-Config):**

1. **Dein Vorname** — text input, placeholder "z.B. Mia", autofocus, maxlength 40
2. **Klausurdatum** — date input, min=heute
3. **Kurs** — read-only display field (kein `<input>`), Wert aus `kurs.name`, background `--c-bg`, color `--c-muted`

**API-Config komplett entfernen** aus dem Setup-Screen.  
KI-Einstellungen sind ausschließlich unter Einstellungen verfügbar.

**Primärer CTA:**
```
Text:      "Lernkreis starten →"
Typ:       .btn--primary .btn--block
Disabled:  wenn name.trim() leer
```

**Datenschutz-Hinweis:**
```
font-size: 11px, color: --c-muted, text-align: center
"Daten werden nur lokal in deinem Browser gespeichert."
```

---

## 6. Home Screen

### 6.1 Aktueller Zustand (v3.1)

- `.home-layout` mit `flex-direction: column` (mobile) und 2-col auf ≥1100px
- Radar-Karte nimmt 55% ein, Info-Spalte 40% — beide zu klein auf 1280px
- Kein eigener Header — Kontext fehlt

### 6.2 Neue Anforderung

**Grid-Layout (innerhalb von `.screen-content`):**
```css
.home-layout {
  display: grid;
  grid-template-columns: 1fr 380px;  /* Radar nimmt flex, Info fix 380px */
  gap: 20px;
  height: calc(100vh - var(--header-h) - 40px);  /* kein Überlauf */
  overflow: hidden;
}
```

**Linke Spalte — Radar:**

```
┌────────────────────────────────────────────────┐
│ Lernstand-Radar             [17. Jun]           │
│ ─────────────────────────────────────────────── │
│                                                 │
│              [Radar Chart]                      │
│           (flex: 1, height: auto)               │
│                                                 │
│ ─────────────────────────────────────────────── │
│ [Verlauf: Aus] [Diagnose →]   (nur wenn Daten)  │
└────────────────────────────────────────────────┘
```

- Card nimmt volle Höhe der linken Spalte (`flex: 1, display flex, flex-direction column`)
- Radar-Canvas: `flex: 1, min-height: 0`, `max-height: calc(100vh - 200px)`
- Klick auf Radar-Card → navigiert zu `fortschritt` (nur wenn Diagnose vorhanden)
- Leerzustand (kein Diagnose): zentriertes 🕸️ + Text "Dein Radar wartet" + "Starte die Diagnose…"
- `.radar-pulse`-Animation (bestehend) bleibt unverändert

**Rechte Spalte — Info (380px fix):**

```
┌─────────────────────┐
│ [3] Klausurbereit   │  ← Stat-Chips
│ [4] Noch offen      │
│ [8] Heute geübt     │
├─────────────────────┤
│ FOKUS JETZT         │  ← nur wenn schwächste Themen vorhanden
│ [Chip] [Chip]       │
├─────────────────────┤
│ Verbessert ↑        │  ← nur wenn Verbesserungen vorhanden
│ Thema X             │
├─────────────────────┤
│ [margin-top: auto]  │  ← CTAs am unteren Rand der Spalte
│ [Jetzt üben →]      │
│ [Neue Diagnose]     │
└─────────────────────┘
```

**Stat-Chips:**
```
Layout:      3-spaltig, gleiche Breite
Padding:     12px 8px
Radius:      12px
Value:       font-size 26px, font-weight 700
Label:       font-size 10px, font-weight 600, uppercase, letter-spacing 0.04em
Farben:      --c-success-bg / --c-warn-bg / --c-light
```

**Focus-Chips:**
```
Padding:          6px 14px
Border-radius:    999px
Font-size:        12px, font-weight 600
Inhalt:           [Themenname] + [Score%] — z.B. "Rotationsmechanik 34%"
Farbe:            dynamisch aus scoreConfig(score).bg / .color
Klick:            ue.themaId = t.id; goTo('ueben')
```

**CTAs:**
```
Primär:    .btn--primary .btn--block  "Jetzt üben →"    → goTo('ueben')
Sekundär:  .btn--outline .btn--block  "Neue Diagnose"   → goTo('diagnose')
           oder "Selbstdiagnose starten" wenn noch keine Diagnose
```

---

## 7. Diagnose Screen

### 7.1 Aktueller Zustand (v3.1)

- 2-spaltig auf ≥1100px — funktioniert gut
- Star-Buttons bei 5 Sternen in halber Spalte zu eng

### 7.2 Neue Anforderung

**Nur eine Änderung:** Star-Button-Breite sicherstellen.

Das 2-spaltige Grid (`.themen-grid`) bleibt. Die Star-Buttons müssen auf halber Desktop-Breite (ca. 480px nach Sidebar-Abzug) passen.

```css
/* Sicherstellen dass Star-Buttons nicht abgeschnitten werden */
.star-btn {
  min-width: 0;      /* Verhindert Overflow */
  flex: 1;
}

.star-btn__stars {
  font-size: 10px;   /* Leicht reduziert für 5-Stern-Row in halber Spalte */
  letter-spacing: -1px;
}

.star-btn__label {
  font-size: 9px;
}
```

Alles andere am Diagnose-Screen bleibt unverändert.

---

## 8. Üben Screen — Split Layout

### 8.1 Aktueller Zustand (v3.1)

Drei getrennte Screens:
- `ueben-auswahl` (Thema/Typ/Niveau + Button)
- `ueben-aufgabe` (Aufgabe + Tipp-Buttons + Textarea)
- `ueben-ergebnis` (Feedback + Selbstbewertung)

Drei Seiten-Wechsel für eine einzige Übungseinheit.

### 8.2 Neue Anforderung

**Ein einziger Screen `ueben`** mit drei Zonen.

```
┌─────────────────────────────────────────────────────────────┐
│ SELECTOR BAR (eine Zeile)                                    │
│ [Thema ▾] [Typ ▾] [●○○○ ●●○○ ●●●○ ●●●●] [Aufgabe gen. →]   │
├─────────────────────────────┬───────────────────────────────┤
│ LINKE SPALTE                │ RECHTE SPALTE                 │
│ (Aufgabe + Tipps)           │ (Antwort + Ergebnis)          │
│                             │                               │
│ Aufgabe-Card                │ Textarea (flex: 1)            │
│ Tipp-Buttons                │                               │
│ Score-Indikator             │ [Einreichen →]                │
│                             │                               │
│                             │ [Ergebnis wenn vorhanden]     │
│                             │                               │
│                             │ Session-Counter               │
└─────────────────────────────┴───────────────────────────────┘
```

**Selector Bar:**
```
Layout:     flex, align-items center, gap 12px, flex-wrap wrap
Position:   über dem Split-Grid, margin-bottom 16px

Thema:      <select> mit .field, flex: 2, max-width 280px
Typ:        .btn--sm, aktiv = .btn--primary, inaktiv = .btn--outline
Niveau:     .btn--sm, Inhalt = diffStr(lvl) = "●○○○" etc.
Generate:   .btn--primary, margin-left auto, Text = "Aufgabe generieren →"
```

**Split Grid:**
```css
.ueben-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: calc(100vh - var(--header-h) - 120px);
  overflow: hidden;
}

.ueben-left,
.ueben-right {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}
```

**Linke Spalte — Zustände:**

*Leerzustand (kein Task generiert):*
```
Zentrierte Card (flex: 1)
Icon: 📝
Text: "Wähle ein Thema und generiere eine Aufgabe"
Opacity: 0.6
```

*Task vorhanden:*
```
Aufgabe-Card:
  .card .card--accent-left
  Header:  [Typ-Badge] [Themenname] [Niveau rechts]
  Body:    Aufgabentext, font-size 14px, line-height 1.6

Tipp-Buttons (gestaffelt — immer nur einer sichtbar):
  .btn--ghost, width 100%
  Text: "💡 Tipp [N] von 3 anzeigen (−20 Pkt.)"
  Jeder Button erscheint erst wenn der vorherige geklickt wurde

Angezeigte Tipps:
  .tipp-box (bestehend), border-left 3px solid --c-accent
  Animation: slideDown (bestehend)

Score-Indikator (sichtbar sobald min. 1 Tipp genutzt):
  Layout: flex, align-items center, gap 10px
  Label:  "Kompetenz" (11px, --c-muted)
  Bar:    flex: 1, height 8px, border-radius 999px
          Fill: breite = kompScore%, Farbe dynamisch
          (≥80: --c-success / ≥50: --c-amber / <50: --c-error)
          Transition: width 0.4s ease, background 0.3s ease
  Value:  "[N] Pkt." (12px, 700, --c-primary)
```

**Rechte Spalte — Zustände:**

*Kein Task:*
```
Zentrierter Text (opacity 0.4): "Aufgabe generieren um zu antworten"
```

*Task vorhanden, kein Ergebnis:*
```
Label:    "Deine Antwort" (.card-label)
Textarea: .field, rows 10, resize vertical, flex: 1, min-height 200px
          placeholder: "Schreib deine Antwort hier — Formeln in Textform sind ok."

CTA:      .btn--primary .btn--block "Antwort einreichen →"
          Disabled wenn antwort.trim() leer oder ue.loading
```

*Ergebnis — Musterlösung (nicht-SC):*
```
Card 1:   "Deine Antwort" (.card-label) + Antworttext
Card 2:   "Musterlösung" (.card-label, .card--accent-left) + Mustertext
Card 3:   "Wie nah warst du?" (.card-label)
          → [✓ Lag ich richtig] .btn--success flex: 1
          → [✗ Noch unsicher]  .btn--danger  flex: 1
          Beide Buttons rufen clearTask() auf nach selfAssess()
```

*Ergebnis — Single Choice:*
```
Card 1:   Richtig/Falsch-Banner (.card--success / .card--error)
          "✓ Richtig!" oder "✗ Leider falsch"
          "Deine Wahl: A · Korrekt: C"
Card 2:   "Auflösung" (.card--accent-left) + Erklärungstext
Buttons:  [Neue Aufgabe →] .btn--primary  → clearTask()
          [Zur Startseite] .btn--outline  → goTo('home')
```

*Session Counter (immer sichtbar wenn session.aufgaben.length > 0):*
```
Position:  margin-top: auto (am unteren Rand der rechten Spalte)
Card:      padding 12px 16px, text-align center
Text:      "Session: [N] Aufgaben · Richtig: [N]"
           font-size 12px, --c-muted
```

**Alpine.js: Screens zusammenführen**

> Hinweis an Dev Team: Die drei Screens `ueben-auswahl`, `ueben-aufgabe`, `ueben-ergebnis` werden zu einem einzigen Screen `ueben` zusammengeführt. Die Zustände (`ue.taskReady`, `ue.resultReady`) steuern via `x-show` welche Inhalte sichtbar sind — kein `goTo()` mehr innerhalb des Üben-Flows.

Neue State-Felder in `app()`:
```javascript
ue.taskReady:   false   // true nach generateTask()
ue.resultReady: false   // true nach submitAnswer()
```

`clearTask()` setzt beide auf `false` und leert alle Felder.

---

## 9. Fortschritt Screen

### 9.1 Neue Anforderung — Score-Bars statt Stufen-Badges

Das bestehende 2-spaltige Layout (`.fortschritt-grid`) bleibt erhalten.

**Themen-Lernstand — Score-Bars (neu):**

Die bestehenden Themen-Fortschritts-Balken (`(t.stufe ?? 0) * 20`) werden durch ein kontinuierliches Score-System ersetzt:

```
Pro Thema:
  Header:  Themenname (12px, 600) | Score-Badge (dynamisch)
  Bar:     height 8px, border-radius 999px, overflow visible

Score-Badge:
  Wert:    Math.round(liveScores[t.id]) + "%" (oder "—" wenn null)
  Farben:  dynamisch aus scoreConfig(score):
           < 20%: --c-error-bg / --c-error
           < 40%: --c-warn-bg  / --c-warn
           < 60%: --c-amber-bg / --c-amber
           < 80%: --c-success-bg / --c-success
           ≥ 80%: --c-light / --c-primary
```

**Klausurniveau-Marker auf jeder Bar:**
```css
.score-bar {
  position: relative;   /* Für Marker-Positionierung */
}

.score-bar__marker {
  position: absolute;
  top: -3px;
  left: 75%;            /* Klausurniveau = 75% */
  width: 2px;
  height: 14px;
  background: var(--c-success);
  border-radius: 1px;
}

.score-bar__marker::after {
  content: "Ziel";
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 9px;
  font-weight: 700;
  color: var(--c-success);
  white-space: nowrap;
}
```

**Score-Bar Fill — Animation:**
```css
.score-bar__fill {
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              background 0.4s ease;
}
```

---

## 10. Radar Chart — Kontinuierliche Animation

### 10.1 Aktueller Zustand (v3.1)

`radar.js`: Chart wird bei jedem Update via `destroy()` + `new Chart()` neu erstellt.  
Das erzeugt einen harten visuellen Sprung ohne Animation.

### 10.2 Neue Anforderung

**Chart niemals zerstören wenn er bereits existiert** — stattdessen Daten aktualisieren.

```javascript
// In RadarManager.render():
if (this._instances[canvasId]) {
  const chart = this._instances[canvasId]
  chart.data.labels   = labels
  chart.data.datasets = datasets
  chart.update('active')   // ← löst smooth animation aus
  return chart
}
// Nur beim ersten Render: new Chart(...)
```

**Chart.js Animation Options:**
```javascript
animation: {
  duration: 600,
  easing: 'easeInOutQuart',
}
```

**Radar nach jeder Task-Bewertung live updaten:**

Nach jedem `_applyTaskResult()` in `app.js` wird `_updateLiveRadar()` aufgerufen,  
das den Home-Radar mit dem aktuellen `liveScores`-Stand aktualisiert — ohne neuen Diagnose-Snapshot zu erstellen.

```javascript
_updateLiveRadar() {
  if (!this.hasDiagnose) return
  const snap = {
    datum: new Date().toISOString(),
    scores: this.kurs.themen.map(t => ({
      id: t.id,
      score: this.liveScores[t.id] ?? 0
    })),
  }
  radar.update('radarHome', this.kurs.themen, [snap])
}
```

---

## 11. Datenmodell — Score-System

> Dieses Kapitel beschreibt die einzige Änderung am Datenmodell.  
> Alle anderen App-Zustände in `app.js` bleiben unverändert.

### 11.1 Aktueller Zustand (v3.1)

```javascript
// Diagnose-Snapshot:
{ datum: ISO, bewertungen: [{ id, stufe: 1–5 }] }

// Radar-Achse:
stufe → val (direkt 0–5 diskret)
```

### 11.2 Neue Anforderung

```javascript
// Diagnose-Snapshot:
{ datum: ISO, scores: [{ id, score: 0.0–100.0 }] }

// Stufe → Score Mapping (Selbstdiagnose setzt Anker):
const STUFE_TO_SCORE = { 1: 10, 2: 30, 3: 50, 4: 75, 5: 92 }

// Radar-Achse (0–5 float):
const scoreToAxis = score => (score ?? 0) / 20

// Klausurniveau:
const KLAUSUR_SCORE = 75
const KLAUSUR_AXIS  = 3.75   // = 75/20
```

**Adaptivitäts-Deltas (ersetzen bisherige Schwierigkeitsstufen-Logik):**
```javascript
const SCORE_DELTA = {
  correct_0tips: +8,
  correct_1tip:  +3,
  correct_2tips: -2,
  correct_3tips: -5,
  wrong:         -10,
}

function applyDelta(currentScore, korrekt, tipps) {
  const deltas = korrekt
    ? [+8, +3, -2, -5]
    : [-10]
  const delta = korrekt ? deltas[Math.min(tipps, 3)] : deltas[0]
  return Math.max(0, Math.min(100, currentScore + delta))
}
```

**Klausurniveau-Linie im Radar:**
```javascript
// _klausurniveauLine() in radar.js:
data: new Array(axisCount).fill(KLAUSUR_AXIS),  // 3.75 statt 4
label: `Klausurniveau (${KLAUSUR_SCORE}%)`
```

**Migration alter Daten:**
```javascript
// In init(): alte bewertungen-Snapshots migrieren
const raw = store.get('diagnosen') ?? []
this.diagnosen = raw.map(d => {
  if (d.scores) return d  // bereits neues Format
  return {
    datum: d.datum,
    scores: (d.bewertungen ?? []).map(b => ({
      id: b.id,
      score: STUFE_TO_SCORE[b.stufe] ?? 0,
    })),
  }
})
```

---

## 12. Entfernte Elemente

Folgende Elemente werden aus dem Prototyp **vollständig entfernt**:

| Element | Datei | Begründung |
|---|---|---|
| `.nav-bar` (bottom) | styles.css | Ersetzt durch `.sidebar` |
| `--app-max-w: 440px` | styles.css | Desktop-first, keine Begrenzung |
| `backdrop-filter: blur` auf Nav | styles.css | Unnötiger Effekt |
| API-Config im Setup-Screen | index.html | Nur in Einstellungen verfügbar |
| Screen `ueben-auswahl` | index.html | Zusammengeführt in `ueben` |
| Screen `ueben-aufgabe` | index.html | Zusammengeführt in `ueben` |
| Screen `ueben-ergebnis` | index.html | Zusammengeführt in `ueben` |
| `goTo('ueben-auswahl')` etc. | app.js | Ersetzt durch `clearTask()` |
| `.home-grid` | styles.css | Ersetzt durch `.home-layout` |
| Radar-Screen als eigenständiger Screen | index.html | Radar lebt im Home-Dashboard |
| KI-Verbindungsblock im Einstellungen-Screen | index.html | KI nicht aktiv in diesem Prototyp |

---

## 13. Barrierefreiheit & Education-Standards

Folgendes muss bei der Umsetzung sichergestellt werden:

- Alle interaktiven Elemente haben `type="button"` (kein unbeabsichtigter Form-Submit)
- Alle `<input>` und `<textarea>` haben ein assoziiertes `<label>` via `for`/`id`
- Farbkontrast: alle Text/Hintergrund-Kombinationen ≥ 4.5:1 (WCAG AA)
- Focus-Ring: `box-shadow: 0 0 0 3px rgba(123,79,166,0.12)` bei Fokus auf `.field`
- Keine rein farbliche Information ohne textuellen Zusatz (Score-Badges haben immer Text)
- `aria-disabled="true"` bei disabled Buttons (ergänzend zu HTML `disabled`)

---

## 14. Nicht geändert

Folgendes bleibt **vollständig unverändert** gegenüber v3.1:

- `api.js` — Datei bleibt bestehen (wird für Kursinhalt-Ladesystem benötigt), KI-Calls werden aber nicht aktiv genutzt
- Kursinhalt-Ladesystem (`_tryAutoLoad`, `_pickFromPool`) — deterministischer Offline-Modus bleibt vollständig erhalten
- Diagnose-Logik (Stern-Rating, Verifikations-Flow)
- `.card`, `.badge`, `.btn`, `.field` Komponenten (CSS)
- `.tipp-box`, `.verif-box` (CSS + HTML)
- `.star-btn` System
- Alpine.js Grundstruktur (`x-data="app()"`, `x-init="init()"`)
- LocalStorage-Schema (außer Diagnose-Format, siehe Kap. 11)

---

## 15. KI-Einbindung — Prototyp-Entscheidung

Dieser Prototyp verwendet **keine aktive KI-Einbindung**. Das hat direkte Konsequenzen für zwei Bereiche:

### Einstellungen-Screen

Der bestehende Einstellungen-Screen in v3.1 zeigt als primären Inhalt die KI-Verbindungskonfiguration (API Key, Modell, Verbindungstest). Da KI in diesem Prototyp nicht genutzt wird, ist dieser Bereich für Testnutzer irrelevant und erzeugt unnötige Verwirrung.

**Anforderung:**
- KI-Verbindungsblock (`API Key`, `Modell`, `Verbindung testen`) aus dem Einstellungen-Screen **ausblenden** — nicht entfernen, nur `x-show="false"` oder in einen collapsed-Bereich verschieben
- Der Einstellungen-Screen zeigt stattdessen primär: **Kursinhalt laden** (deterministischer JSON-Upload) + **Daten zurücksetzen**
- Optional: Hinweistext "KI-Einbindung ist in dieser Version nicht aktiv"

### Üben-Screen

Der Üben-Flow in v3.1 hat zwei Modi: deterministisch (Kursinhalt-JSON vorhanden) und KI-generiert (kein JSON, callAI() wird aufgerufen). Im Prototyp läuft ausschließlich der deterministische Modus.

**Anforderung:**
- KI-Fallback-Pfad (`callAI()`) bleibt im Code erhalten — wird aber nicht ausgelöst solange kein API Key gesetzt ist
- Mock-Antworten aus `api.js` (`getMockResponse()`) werden weiterhin als Fallback genutzt wenn kein Kursinhalt-JSON geladen ist
- Kein Hinweis auf KI in der UI — die Aufgabengenerierung fühlt sich für den Nutzer identisch an egal ob deterministisch oder Mock

