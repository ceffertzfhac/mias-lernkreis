# Entscheidungslog — Mias Lernkreis Prototyp

Chronologisches Log aller wichtigen Design- und Architekturentscheidungen.
Letzte Aktualisierung: 2026-03-23

---

## 2026-03 — Prototype_v4

### E-001: Tailwind CDN entfernen
**Entscheidung:** v4 verwendet kein Tailwind mehr — pure Custom CSS.
**Problem:** Tailwind CDN injiziert Styles dynamisch per JavaScript nach dem `<link>`-Tag
im DOM. Das überschreibt eigene CSS-Regeln (u.a. Sidebar-Offset). In v3.x führte das zu
hartnäckigen Layout-Bugs die mit `margin-left` statt `padding-left` umgangen werden mussten.
**Lösung:** Vollständiger Verzicht auf Tailwind CDN. Alle Styles in `styles.css`.

### E-002: CSS Grid App-Shell statt Flex
**Entscheidung:** App-Shell als `display: grid; grid-template-columns: 200px 1fr`.
**Problem:** v3.x nutzte Flex + `margin-left` auf `.app-shell` für Sidebar-Offset.
**Vorteil:** Grid definiert die zwei Spalten deklarativ — kein Offset-Calculation nötig,
Sidebar und Content sind natürliche Grid-Kinder.

### E-003: Score-System statt Stufen
**Entscheidung:** Kontinuierlicher Score 0–100% ersetzt Stufen 1–5.
**Begründung:** Lernfortschritt ist fließend, nicht stufenweise. Robin's UX-Spec §11.
**Migration:** Automatisch in `init()` via `STUFE_TO_SCORE = {1:10, 2:30, 3:50, 4:75, 5:92}`.

### E-004: Merged Üben-Screen
**Entscheidung:** Drei alte Screens (`ueben-auswahl`, `ueben-aufgabe`, `ueben-ergebnis`)
zu einem einzigen `ueben`-Screen zusammengefasst.
**Begründung:** Split-Layout (1fr/1fr) ermöglicht gleichzeitige Darstellung von
Aufgabe und Ergebnis/Musterlösung. `ue.taskReady` und `ue.resultReady` steuern Inhalt via `x-if`.

### E-005: Live Scores (nicht persistiert)
**Entscheidung:** `liveScores` als reaktiver State der nicht in localStorage gespeichert wird.
**Begründung:** Live Scores repräsentieren den Lernstand *innerhalb einer Session*.
Eine echte Diagnose-Snapshot wird erst bei `completeDiagnose()` gespeichert.
**Konsequenz:** Nach Page-Reload basieren Live Scores wieder auf der letzten gespeicherten Diagnose.

### E-006: Radar chart.update('active') statt destroy
**Entscheidung:** Radar-Chart wird nie zerstört und neu erstellt — nur `chart.update('active')`.
**Problem:** Destroy + New Chart erzeugte Flackern und verlor den Animations-State.
**Vorteil:** Smooth Animationen bei jedem Daten-Update, kein DOM-Flackern.

### E-007: Verifikation-Format {frage, musterloesung}
**Entscheidung:** Verifikations-JSONs speichern Objekte `{frage, musterloesung}` statt plain strings.
**Begründung:** Pädagogisch sinnvoll: Studentin soll erst selbst nachdenken, dann aktiv
die Musterlösung einblenden — nicht sofort sehen.
**Rückwärtskompatibilität:** App-Code prüft `typeof raw === 'object'` — plain strings
funktionieren weiterhin (zeigen nur keine Musterlösung).

### E-008: Doppel-Progress Bar im Topbar
**Entscheidung:** Topbar zeigt zwei Bars: Zeitfortschritt + Lernfortschritt.
**Zeit-Bar:** grün→rot, von erstem Diagnose-Tag bis Klausur.
**Lern-Bar:** rot→grün, relativer Fortschritt von Basis zu Klausurniveau (siehe E-012).
**Idee dahinter:** Ein Blick = zwei Informationen. Lern-Bar hinter Zeit-Bar = Handlungsbedarf.
**Gradient-Technik:** Gradient auf Track, Cover-Maske von rechts — korrekte Farbe an
jeder Füllposition ohne JS-Farbberechnung.

### E-009: Animierter Display-State für Progress Bars
**Entscheidung:** Separater `zeitProzentAnimated`/`lernProzentAnimated` State (startet bei 0).
**Problem:** Computed Getters haben beim ersten Render direkt den finalen Wert — CSS
`transition` hat nichts zu animieren.
**Lösung:** Display-State startet bei 0, wird nach `$nextTick` + 50ms auf den echten
Wert gesetzt → CSS Transition animiert sauber von 0 zum Zielwert.

---

## 2026-03 — Kursinhalt & Dozenten-Prompt

### E-010: Kein meta.json ab v4
**Entscheidung:** Verifikationsdaten direkt in `thema_X/verifikation.json`, kein `meta.json`.
**Problem:** meta.json war ein unnötiger Umweg — die App lud `verifikation.json` direkt,
meta.json wurde nicht genutzt.

### E-012: Lernfortschritt relativ zur Basis (GAP-Modell)
**Entscheidung:** `lernProzent` berechnet den Fortschritt relativ zur ersten Diagnose,
nicht absolut zum Score-Maximum.
**Problem:** Absolutes Modell (Score/75) zeigte sofort z.B. 67% wenn die erste Diagnose
50% ergab — obwohl die Studentin noch nichts gelernt hatte.
**Formel pro Thema:** `(aktuell - baseline) / (KLAUSUR_SCORE - baseline)`
- 0% = Ausgangslage der ersten Diagnose
- 100% = alle Themen auf Klausurniveau (75%)
- Themen die bei der ersten Diagnose bereits ≥ 75% hatten: zählen als 100%
- Score unter Baseline: wird auf 0% geclampt (kein negativer Fortschritt)
**Neue Computed:** `lernBasis` (Scores der ersten Diagnose), `lernProzent` (GAP-Formel).

### E-013: „Heute geübt" — persistenter Tages-Counter
**Entscheidung:** `heuteGeuebt` zählt alle Lernaktivitäten des Tages und wird in localStorage persistiert (`heute_log: { date, count }`).
**Problem:** Alter `session.aufgaben.length`-Counter zählte nur Üben-Aufgaben, nicht Selbstdiagnose-Verifikationen. Außerdem ging der Stand bei jedem Reload verloren — unbrauchbar aus Nutzersicht.
**Lösung:** Zentraler `_countActivity()` Helper wird aufgerufen bei:
- `_applyTaskResult()` — jede bewertete Üben-Aufgabe
- `confirmVerifikation()` — Verifikation bestätigt (✓ Ich kann das)
- `lowerVerifikation()` — Stufe gesenkt (auch aktives Lernen)
**Tages-Reset:** `init()` vergleicht gespeichertes Datum mit `todayInput()` — neuer Tag = count 0.
**Konsequenz:** Zeigt nun korrekt, wie viel die Nutzerin *heute insgesamt* gelernt hat — nicht nur in der aktuellen Browser-Session.

### E-011: Dozenten-Prompt als kollaborativer Editor
**Entscheidung:** Dozenten-Prompt v4 arbeitet schrittweise: Status-Analyse → Checkpoint →
gezielte Generierung. Kein blindes Batch-Generieren.
**Begründung:** Qualität > Quantität. Inkrementeller Aufbau vermeidet Duplikate und
Verschlechterung existierender Inhalte. Batch bleibt möglich auf explizite Anweisung.

---

## 2026-02/03 — Prototype_v3.x (Rückblick)

### E-000: Sidebar-Offset via margin-left (v3.1 Fix)
**Problem:** `padding-left` auf `.has-nav` wurde von Tailwind CDN überschrieben.
**Fix:** `margin-left: var(--nav-sidebar-w)` auf `.app-shell` — kein Tailwind-Einfluss
auf margin. In v4 durch CSS Grid vollständig ersetzt.
