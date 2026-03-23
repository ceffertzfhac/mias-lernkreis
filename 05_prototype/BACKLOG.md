# Backlog — Mias Lernkreis Prototype_v4

Letzte Aktualisierung: 2026-03-23 (heute-geübt-fix)

---

## 🔴 Hoch

| ID | Feature | Status |
|---|---|---|
| **A2** | Radar-Screen mit Verlauf — showVerlauf-Modus, Legende, letzte 5 Diagnosen | offen |
| **A5** | Empty States — Radar & Fortschritt ohne Diagnose: Onboarding-Hinweis statt leerem Chart | ✅ erledigt |
| **B4** | Lernstand exportieren — JSON-Download aus Einstellungen | ✅ erledigt |
| **L1** | Feedback-Animation nach jeder Aufgabe/Frage — Score-Delta als fliegende Zahl: grün „+8" bei richtig, rot „−10" bei falsch, grau „±0" bei neutral; Animation: aufsteigen + fade-out, sofort sichtbar nach Bewertung (Üben + Verifikation) | ✅ erledigt |
| **K1** | Neuen Nutzer anlegen — mehrere Profile auf einem Gerät (z.B. Lerngruppe) | offen |
| **K2** | Nutzer löschen — einzelnes Profil entfernen ohne alle Daten zu löschen | offen |

---

## 🟡 Mittel

| ID | Feature | Status |
|---|---|---|
| **H1** | Tagesziele & Wochenziele — basierend auf verbleibender Zeit bis Klausur und aktuellem Lernfortschritt (GAP-Modell): wie viele Aufgaben pro Tag/Woche nötig, um 100% zu erreichen | offen |
| **I1** | Diagnose-Führung — Fortschrittsanzeige welche Themen bereits bewertet wurden; beim ersten Mal geführter Workflow mit „Später weitermachen"-Button; Wiedereinstieg greift offenen Stand auf | ✅ erledigt |
| **J1** | Kontent-Prompt: Nomenklatur & Vektoren skripttreu — Formelzeichen exakt wie im Skript (Bsp: F_Z statt T für Zugkraft); Vektoren immer als Vektoren (Pfeil-Notation), nie als Skalar wenn die Größe ein Vektor ist | offen |
| **A3** | Fortschritt: Diagnose-Verlauf — Zeitachse der letzten Diagnosen | offen |
| **E1** | Radar-Icon in Sidebar anpassen — aktuell Hexagon, nicht passend | offen |
| **E2** | UI/UX Datum ändern verbessern — funktional, aber unpolished | offen |
| **C1** | GitHub Pages auf v4 umstellen — `docs/` noch auf v3 | offen |
| **C3** | Testing-Phase vorbereiten — `06_test/` mit Testprotokoll-Vorlage | offen |
| **C4** | Testrunde mit Studierenden | offen |

---

## 🟢 Niedrig / Später

| ID | Feature | Status |
|---|---|---|
| **A1** | Mobile Responsiveness v4 | offen |
| **A6** | Barrierefreiheit — aria-labels, Fokus-Ring, Keyboard-Navigation | offen |
| **B1** | Kursinhalt laden (Upload) im Einstellungen-Screen | offen |
| **B2** | Weitere Kurse in config.js | offen |
| **B3** | KI-Einbindung aktivieren | offen |
| **C2** | Prototype_v3 archivieren | offen |

---

## ✅ Erledigt

| ID | Feature | Commit |
|---|---|---|
| **A4** | Klausurdatum anpassen via Topbar-Chip und Einstellungen | `cdcc3c2` |
| **D1** | Musterlösungen in Selbstdiagnose — Verifikations-Box zeigt Musterlösung | `2e7a977` |
| **D2** | Musterlösung aktiv einblenden — erst nach Klick sichtbar | `a48a396` |
| **E3** | Bug: „Invalid Date" in Einstellungen — examFmt Arrow-Function-Fix | `a48a396` |
| **E4** | Namen anpassbar — Nutzername editierbar in Einstellungen, Enter + Speichern-Button | `ee159fd` |
| **E7** | „Heute geübt" nutzerzentriert — persistent (localStorage), alle Aktivitäten (Üben + Verifikation), Tages-Reset | `2e6c201` |
| **A5** | Empty States — Onboarding-Karte Home (3 Schritte), CTA-Prio, Fortschritt-Empty mit Radar-Placeholder | `pending` |
| **E5** | Lernzeit-Progress Bar — von erstem Diagnose-Tag zur Klausur | `9c42f02` |
| **E6** | Lernzeit-Progress Bar permanent im Topbar — Doppel-Bar Zeit + Lern | `1dacc5a` |
| **F1** | Dozenten-Prompt v4 — kollaborativer Modus, Status-Analyse, {frage, musterloesung} | `0f2c759` |
| **G1** | Lernfortschritt-Logik: GAP-Modell (0% = erste Diagnose, 100% = Klausurniveau) | `1304b4f` |
| **B4** | Lernstand exportieren — JSON-Download (Name, Diagnosen, Fortschritt) aus Einstellungen | `pending` |
