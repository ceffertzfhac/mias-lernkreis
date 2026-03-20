# Testfeedback — Mias Lernkreis Solo

## Prototyp-Info
- **Datei:** `mias-lernkreis-solo.html`
- **Persona:** Mia — 22 Jahre, BWL/Psych, FH Köln

---

## Runde 1 — 2026-03-20

**Feedback von:** Projektleiter (madelconsulting)
**Getestete Version:** v1 (Initial Build)

### Befunde

| # | Bereich | Befund | Priorität |
|---|---------|--------|-----------|
| 1 | Setup — API | Keine Rückmeldung, ob der API-Key akzeptiert wurde. Testverbindung zum LLM gewünscht. | Hoch |
| 2 | Setup — Prüfungsdatum | Fix auf 45 Tage codiert. User möchte Datum selbst wählen. | Hoch |
| 3 | Diagnose — Stufensystem | 3-stufig (🟢🟡🔴) zu grob. 4-stufiges System gewünscht. | Hoch |
| 4 | Diagnose — Symbolik | Ampel-Metapher passt nicht zu 4 Stufen. Sterne oder andere Symbolik verwenden. | Hoch |
| 5 | Diagnose — Verifikation | Jede Einschätzung ≥ Stufe 2 soll eine passende Frage auslösen; danach Einschätzung ggf. anpassen. | Hoch |
| 6 | Visualisierung Lernstand | Immer Spinnendiagramm verwenden; relevante Achsen müssen pro Kurs identifiziert sein. | Hoch |
| 7 | Stufensystem | 5 statt 4 Stufen gewünscht; kalibriert so, dass Stufe 4 = Klausurniveau. | Hoch |

### Umgesetzte Änderungen (v2)
- [x] API-Verbindungstest mit Live-Feedback in der Setup-Maske
- [x] Freies Prüfungsdatum per Date-Picker (Default: heute + 45 Tage)
- [x] 5-stufige Bewertung (Stufe 4 = Klausurniveau): ★☆☆☆☆ Lernbedarf / ★★☆☆☆ Grundlagen / ★★★☆☆ Verstanden / ★★★★☆ Klausurniveau / ★★★★★ Exzellent
- [x] Sterne ersetzen Ampel-Symbolik durchgängig
- [x] Inline-Verifikationsfrage bei Stufe ≥ 2 mit KI-generierter Frage; Bestätigen oder Stufe senken
- [x] Spinnendiagramm als primäre Lernstand-Visualisierung; kursabhängige Achsen (= Themen des Kurses)
- [x] Referenzlinie „Klausurniveau" (Stufe 4) im Radar sichtbar

---

## Runde 2 — 2026-03-20

**Feedback von:** Projektleiter (madelconsulting)
**Getestete Version:** v2 → v3 (Prototype_v3/)

### Befunde

| # | Bereich | Befund | Priorität |
|---|---------|--------|-----------|
| 1 | Architektur | v2 als Einzeldatei schwer wartbar. Separate Dateien für Config, API, Radar, App gewünscht. | Hoch |
| 2 | API-Test — file:// | Direktes Öffnen der HTML aus VS Code (file://-Protokoll) blockiert alle fetch()-Anfragen. Fehlermeldung „Load failed" nicht hilfreich. | Hoch |
| 3 | API-Test — Live Server | Live Server (http://127.0.0.1:5500) sendet Anfrage, aber KI Connect NRW blockiert localhost via CORS (kein Access-Control-Allow-Origin-Header). TypeError-Meldung nicht verständlich. | Hoch |
| 4 | Deployment | Für echte KI-Verbindung muss Prototyp auf öffentlichem Webserver laufen. | Hoch |

### Umgesetzte Änderungen (v3)

- [x] Multi-File-Architektur: `Prototype_v3/` mit `js/config.js`, `js/api.js`, `js/radar.js`, `js/app.js`, `css/styles.css`, `index.html`
- [x] Verständliche Fehlermeldung bei file://-Protokoll: Hinweis auf VS Code Live Server
- [x] Verständliche Fehlermeldung bei localhost-CORS-Block (TypeError): Hinweis auf öffentlichen Webserver oder Demo-Modus
- [x] Deployment auf Netlify: https://taupe-torte-096752.netlify.app

---

## Runde 3 — _Datum eintragen_

**Feedback von:**
**Getestete Version:** v3

### Befunde

| # | Bereich | Befund | Priorität |
|---|---------|--------|-----------|
| | | | |

### Umgesetzte Änderungen (v4)
- [ ]
