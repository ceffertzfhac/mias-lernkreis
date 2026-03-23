# Architektur — Mias Lernkreis Prototype_v4

Letzte Aktualisierung: 2026-03-23

---

## Überblick

Mias Lernkreis ist eine **Single-Page-Web-App** ohne Build-Prozess, Bundler oder Backend.
Alles läuft lokal im Browser via VS Code Live Server.

**Tech-Stack:**
| Komponente | Technologie | Version |
|---|---|---|
| Reaktivität | Alpine.js | v3 (CDN) |
| Charts | Chart.js | v4.4.2 (CDN) |
| Styling | Custom CSS (keine Frameworks) | — |
| Datenpersistenz | localStorage | — |
| Kursinhalt | Statische JSON-Dateien | — |
| KI (vorbereitet) | kiconnect.nrw API | nicht aktiv |

**Warum kein Tailwind?** Tailwind CDN injiziert Styles dynamisch per JS — das überschreibt
eigene `<link>`-Styles im DOM-Cascade. v4 verzichtet vollständig auf Tailwind, um
Cascade-Konflikte zu eliminieren (Problem aus v3.x gelernt).

---

## Dateistruktur

```
Prototype_v4/
├── index.html          — Alle Screens (Alpine x-show), CDN-Imports
├── css/
│   └── styles.css      — Design Tokens, Komponenten, Layout
├── js/
│   ├── config.js       — Konstanten: STUFEN, KURSE, Score-System, Farben
│   ├── api.js          — callAI(), testConnection(), Mock-Fallbacks
│   ├── radar.js        — RadarManager-Klasse (Chart.js-Wrapper)
│   └── app.js          — Alpine app()-Funktion: gesamter State + alle Methoden
└── kursinhalt/         — Deterministischer Kursinhalt (JSON)
    ├── kurs_manifest.json
    ├── thema_1/
    │   ├── verifikation.json
    │   ├── berechnen/niveau_1–4.json
    │   └── single_choice/niveau_1–4.json
    └── ...
```

**Script-Ladereihenfolge in index.html:**
```
Chart.js → config.js → api.js → radar.js → app.js → Alpine (defer)
```
Reihenfolge ist kritisch: Alpine muss als letztes geladen werden (defer).

---

## App-Shell Layout

CSS Grid, Desktop-first (1280px Basis):

```
┌─────────────┬──────────────────────────────────┐
│             │  TOPBAR (64px)                    │
│  SIDEBAR    ├──────────────────────────────────┤
│  (200px)    │                                  │
│             │  SCREEN CONTENT (flex: 1)        │
│             │                                  │
└─────────────┴──────────────────────────────────┘
```

```css
:root {
  --sidebar-w: 200px;
  --header-h:  64px;
}
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-w) 1fr;
  height: 100vh;
}
```

**Kein Tailwind** — alle Layouts sind in `styles.css` definiert.

---

## Screen-System (Alpine)

Alle Screens existieren im DOM und werden via `x-show` ein-/ausgeblendet.
Ausnahme: komplexe Inhalte im Üben-Screen nutzen `x-if` für echtes DOM-Entfernen
(verhindert Layout-Artefakte bei leerem State).

| Screen | Besonderheit |
|---|---|
| `setup` | Kein App-Shell, eigenes Layout (`.setup-wrap`) |
| `home` | `screen-content--fill` + CSS Grid 1fr/380px |
| `diagnose` | Themen-Grid 2-spaltig |
| `ueben` | `screen-content--fill` + Split-Layout 1fr/1fr |
| `fortschritt` | Scrollbar, 2-col Grid |
| `einstellungen` | Scrollbar, Cards |

---

## Score-System (v4)

Ersetzt das alte Stufen-System (1–5) durch kontinuierliche Scores (0–100%).

```javascript
// config.js
const STUFE_TO_SCORE = { 1: 10, 2: 30, 3: 50, 4: 75, 5: 92 }  // Migration
const SCORE_DELTA = {
  correct_0tips: +8,
  correct_1tip:  +3,
  correct_2tips: -2,
  correct_3tips: -5,
  wrong:         -10,
}
const KLAUSUR_SCORE = 75   // Zielwert
const KLAUSUR_AXIS  = 3.75 // = 75/20, für Radar-Achse (0–5)
```

**Datenmigration:** `init()` prüft ob `d.scores` existiert (v4-Format) oder
`d.bewertungen` (v3-Format) und konvertiert automatisch via `STUFE_TO_SCORE`.

---

## Live Scores

`liveScores: { [themaId]: score | null }` — reaktiver State, **nicht persistiert**.

- Basis: letzter gespeicherter Diagnose-Snapshot
- Aktualisierung: nach jedem Übungs-Ergebnis via `_applyTaskResult()`
- Antrieb: Home-Radar zeigt `liveScores`, nicht gespeicherte Diagnosen
- Reset: beim nächsten App-Start aus letzter Diagnose neu initialisiert

---

## Radar-Chart (RadarManager)

```javascript
// radar.js
class RadarManager {
  render(canvasId, themen, diagnosen, opts)  // Update in-place, kein Destroy
  _buildDatasets(themen, diagnosen, showVerlauf)
  _klausurniveauLine(axisCount)   // grüne Referenzlinie bei 75%
  destroy(canvasId)
  destroyAll()
}
const radar = new RadarManager()
```

**Wichtig:** `chart.update('active')` statt `destroy + new Chart()` — verhindert
Flackern und ermöglicht smooth Animationen. `maintainAspectRatio: false` damit
der Chart den Container exakt füllt.

---

## Topbar: Doppel-Progress Bar

Die Topbar zeigt zwei übereinanderliegende Fortschrittsbars:

| Bar | Bedeutung | Farbe | Berechnung |
|---|---|---|---|
| **Zeit** | Wie viel der Lernzeit ist verstrichen | grün → rot | `(heute - ersterDiagnosetag) / (Klausur - ersterDiagnosetag)` |
| **Lern** | Wie nah der Ø-Score an Klausurniveau | rot → grün | `Ø min(score, 75) / 75` |

**Animations-Pattern:**
```javascript
zeitProzentAnimated: 0  // Display-State (nicht das Computed)
lernProzentAnimated: 0

_animateProgress() {
  this.zeitProzentAnimated = 0
  this.lernProzentAnimated = 0
  this.$nextTick(() => setTimeout(() => {
    this.zeitProzentAnimated = this.zeitProzent
    this.lernProzentAnimated = this.lernProzent
  }, 50))
}
```
Wird aufgerufen bei: `init()`, `goTo('home')` nach Üben, `saveCountdownDate()`, `updateExamDate()`.

**Gradient-Technik:** Gradient liegt auf dem Track, eine `position: absolute; right: 0`
Cover-Maske schrumpft — so zeigt der sichtbare Teil stets den korrekten Farbbereich.

---

## Kursinhalt — Deterministischer Modus

JSON-Dateien werden beim Start automatisch via `_tryAutoLoad()` geladen (fetch auf `kursinhalt/kurs_manifest.json`). Kein Upload nötig — Dateien einfach in den Ordner legen.

**Aufgaben-Pool-System:**
```
kursinhalt/
├── kurs_manifest.json        — Themenstruktur, Metadaten
├── thema_X/
│   ├── verifikation.json     — {frage, musterloesung} je Stufe 1–5
│   ├── berechnen/
│   │   ├── niveau_1.json     — Array von Rechenaufgaben
│   │   └── ...
│   └── single_choice/
│       └── ...
```

**Verifikation-Format (v4):**
```json
{
  "2": [{ "frage": "...", "musterloesung": "..." }],
  ...
}
```
Frühere Versionen hatten plain strings — der App-Code ist rückwärtskompatibel.

---

## Bekannte Entscheidungen / Trade-offs

| Entscheidung | Begründung |
|---|---|
| Kein Build-Prozess | Dozenten öffnen direkt mit Live Server — kein npm nötig |
| Kein Tailwind in v4 | Cascade-Konflikte in v3.x → pure CSS einfacher wartbar |
| localStorage statt DB | Offline-fähig, kein Backend, Datenschutz-unkritisch |
| `x-show` statt `x-if` für Screens | Kein DOM-Flackern beim Screenswitch |
| KI vorbereitet aber inaktiv | Deterministischer Modus für stabiles Testing |
| Kein mobile Layout | Primärer Nutzungskontext ist Laptop (Robin's UX-Spec) |
