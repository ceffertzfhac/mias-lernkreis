# Claude Code Prompt — Mias Lernkreis
**Zwei Standalone HTML Prototypen | DTconsulting | 2026**

---

## Kontext

Baue zwei eigenständige HTML-Prototypen für "Mias Lernkreis" — ein soziales Lernbegleitsystem für Studierende zur strukturierten Prüfungsvorbereitung. Beide Prototypen laufen vollständig lokal als einzelne HTML-Dateien ohne Server, ohne npm, ohne Build-Prozess.

**Persona:** Mia — 22 Jahre, BWL/Psych, FH Köln. Lernt sozial, rät kollektiv, braucht Orientierung während des Lernens und Unterstützung ohne Scham.

---

## Technische Rahmenbedingungen (gelten für beide Prototypen)

**Stack:**
- Einzelne `.html` Datei pro Prototyp — alles inline (HTML + CSS + JS)
- Kein Framework-Build, kein npm, kein Server
- Alpine.js via CDN für Reaktivität
- Tailwind CSS via CDN für Styling
- Chart.js via CDN für Radar-Chart
- LocalStorage für Datenpersistenz (Präfix `mlk_`)

**KI-Integration — KI Connect NRW (OpenAI-kompatibel):**
```javascript
// KI Connect NRW — OpenAI-kompatibler Endpoint
// Basis-URL: https://chat.kiconnect.nrw/api/v1
// Authentifizierung: Bearer Token

async function callAI(systemPrompt, messages) {
  const config = JSON.parse(localStorage.getItem('mlk_api_config') || '{}')
  try {
    const response = await fetch('https://chat.kiconnect.nrw/api/v1/chat/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model || "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    })
    const data = await response.json()
    return data.choices[0].message.content
  } catch (e) {
    return mockResponse(systemPrompt)
  }
}
```

**Setup beim ersten Start:**
- API Key eingeben (KI Connect NRW Bearer Token)
- Modellname eingeben (z.B. `gpt-4o`)
- Alles in `mlk_api_config` in LocalStorage gespeichert
- Endpoint ist fest: `https://chat.kiconnect.nrw/api/v1` — kein Feld nötig
- Reset-Button löscht alles

**Fallback ohne API Key:** Mock-Antworten für alle KI-Calls — Prototyp läuft vollständig ohne API-Zugang.

**Design System:**
```
Hintergrund:  #F6F4FA
Primary:      #4A2C6E
Accent:       #7B4FA6
Light:        #EDE6F5
Erfolg:       #1A5C3A
Warnung:      #7A4A00
Fehler:       #8B1A1A
Text:         #1C1828
Muted:        #7A6E8A
Radius:       12px Cards, 999px Badges
Font:         system-ui, sans-serif
```

**Demo-Kurs (in beiden Prototypen vorbelegt):**
```
Kursname: Physik — FH Aachen
Prüfungsdatum: 45 Tage ab heute
Themen:
  1. Mechanik — Kinematik
  2. Mechanik — Dynamik
  3. Mechanik — Energie & Erhaltungssätze  ← häufig geprüft
  4. Rotationsmechanik
  5. Schwingungen & Wellen
  6. Elektrodynamik I          ← häufig geprüft
  7. Elektrodynamik II
```

---

## PROTOTYP A — Gruppen-Demo
**Dateiname:** `mias-lernkreis-gruppe.html`
**Ziel:** Die soziale Journey demonstrieren — breit, nicht tief.

---

### Setup-Screen
```
Azure API Konfiguration (3 Felder): Endpoint / Deployment / API Key
Name eingeben
Demo-Kurs automatisch geladen
Gruppen-PIN: automatisch generiert (4 Ziffern) oder manuell
"Gruppe erstellen" oder "Gruppe beitreten"
Für Demo: 3 simulierte Mitglieder bereits vorhanden (Jonas, Sarah, Lena)
```

### Screen 1 — Home
```
"Guten Tag, [Name] 👋"
Exam Countdown: "Noch 45 Tage"

Fortschrittsanzeige:
  Zeit:    [████░░░░░░] X% verstrichen  (Farbe: grün → gelb → rot)
  Themen:  [░░░░░░░░░░] 0/7 sicher
  Status:  🟢 "Du bist im Zeitplan."

Gruppen-Kurzansicht: 4 Avatar-Cards
Navigation: Home | Diagnose | Gruppe | Fragen
```

### Screen 2 — Selbstdiagnose
```
Liste der 7 Themen
Für jedes Thema: 3-Button Toggle grün / gelb / rot
Badge "🔥 Häufig geprüft" bei Thema 3 und 6
Progress: "X von 7 bewertet"
"Diagnose abschließen" → Radar + KI-Empfehlung
```

### Screen 3 — Radar + Empfehlung
```
RadarChart (Chart.js) — 7 Achsen
Toggle "Gruppen-Durchschnitt": zweite transparente graue Fläche

Empfehlung-Card (KI via Azure):
  "Du kennst [Thema X] am besten — werde Expertin dafür."
  [Lernvertrag anlegen →]
```

### Screen 4 — Gruppen-Dashboard
```
Gruppen-PIN + Teilen-Button

Mitglieder-Grid (2×2):
  [Du — Thema 3]  [Jonas — Thema 2]
  [Sarah — Thema 5]  [Lena — Thema 1]

Unbesetzte Themen orange markiert

Lernverträge-Liste:
  Jonas — Thema 2 — bis 20.04 — ✓
  Sarah — Thema 5 — bis 25.04 — ⏳
  Du    — Thema 3 — bis 22.04 — ⏳
```

### Screen 5 — Lernvertrag anlegen
```
Thema: Dropdown (vorausgewählt)
Was ich erkläre: Freitext (KI schlägt 3 Lernziele vor)
Format: [Live] [Zusammenfassung] [Video]
Deadline: Datepicker

[Speichern] → Konfetti-Animation
```

### Screen 6 — Anonyme Fragen
```
Textarea + Thema-Dropdown
Routing: [KI] [Dozent] [Peer] [Tutor] (Mehrfachauswahl)
[Anonym stellen]

Feed mit Demo-Fragen (3 vorbelegt)
KI-Antwort Button wenn KI ausgewählt → Azure API
"+X haben dieselbe Frage" Upvote
```

---

## PROTOTYP B — Solo + Wissensüberprüfung
**Dateiname:** `mias-lernkreis-solo.html`
**Ziel:** Selbstdiagnose und Wissensüberprüfung tief ausarbeiten.

---

### Setup-Screen
```
Azure API Konfiguration
Name eingeben
Demo-Kurs automatisch geladen
"Solo starten"
```

### Screen 1 — Home
```
"Guten Tag, [Name] 👋"
Exam Countdown

Fortschrittsanzeige (identisch mit Prototyp A)

Letzte Diagnose + Empfehlung welches Thema heute dran ist
[Diagnose starten →]  [Direkt üben →]

Navigation: Home | Diagnose | Üben | Fortschritt
```

### Screen 2 — Selbstdiagnose
```
Identisch mit Prototyp A.
Nach Abschluss:
  "Möchtest du dein Wissen direkt überprüfen?"
  [Ja, Aufgaben starten →]  [Später]
```

### Screen 3 — Radar mit Verlauf
```
RadarChart aktueller Stand

Toggle "Verlauf anzeigen":
  Bis zu 5 Snapshots überlagert
  Älteste: 15% Opacity → neueste: 100%
  Zeitstrahl unten: klickbare Datumspunkte

Verbesserungs-Feedback:
  "Du hast dich bei Thema 3 verbessert 🎉"

Schwächste Themen als Empfehlung:
  "Fokus heute: Thema 4 und 6"
  [Jetzt üben →]
```

### Screen 4 — Wissensüberprüfung (KERN-FEATURE)

**4a — Aufgaben-Auswahl:**
```
Thema-Auswahl (rot priorisiert)
Aufgabentyp: [Erklären] [Fehler finden] [Aufgabe lösen]
Schwierigkeit: ● ○ ○ / ● ● ○ / ● ● ● (adaptiv)
[Aufgabe generieren → KI]
```

**4b — Erklären-Aufgabe:**
```
KI generiert Aufgabe:
  "Erkläre in eigenen Worten:
   Was ist der Unterschied zwischen
   Impuls- und Energieerhaltung?"

Textarea für Antwort

─── TIPP-SYSTEM ───────────────────────────────
[💡 Gib mir einen Tipp]

Tipp 1 — abstrakt (-20% Kompetenz):
  "Denk an den Zweck — wofür braucht ein
   Unternehmen welches System?"

Tipp 2 — konkreter (-20% Kompetenz):
  "Kostenrechnung blickt nach innen,
   Leistungsrechnung misst den Output."

Tipp 3 — fast vollständig (-20% Kompetenz):
  "Kostenrechnung erfasst interne Kosten.
   Leistungsrechnung bewertet erbrachte
   Leistungen und deren Wert."

Tipp-Zähler: "2 Tipps genutzt — Bewertung: -40%"
────────────────────────────────────────────────

[Antwort einreichen] → KI bewertet
Feedback: "Gut erklärt! Du hast den Kern getroffen."
Radar-Update sofort sichtbar
```

**4c — Fehler-Finden-Aufgabe:**
```
KI generiert fehlerhafte Aussage:
  "Finde den Fehler:
   'Die Trägheitsmoment zeigt
    wie viel Gewinn ein Produkt erzielt.'"

Freitext-Eingabe für Fehler-Identifikation
Tipp-System identisch (3 Stufen)
Auflösung nach Einreichung
```

**4d — Adaptives System:**
```
Nach jeder Aufgabe:
  Richtig, 0 Tipps  → Schwierigkeit +1
  Richtig, 1 Tipp   → Schwierigkeit =
  Richtig, 2+ Tipps → Schwierigkeit -1
  Falsch            → Schwierigkeit -1, anderer Typ

Nach 5 Aufgaben: Session-Zusammenfassung
  Radar-Update: Thema X: Rot → Gelb
  "Noch 2 Sessions bis Grün"
```

### Screen 5 — Fortschritts-Timeline
```
Fortschrittsanzeige (Zeit + Themen + Signal)

Themen-Liste (rot zuerst):
  🔴 Thema 4 — Finanzierung      [Üben →]
  🔴 Thema 6 — Produktionswirt.  [Üben →]
  🟡 Thema 2 — Marketing         [Üben →]
  🟡 Thema 7 — Elektrodynamik II  [Üben →]
  🟢 Thema 1 — Führung           ✓
  🟢 Thema 3 — Rechnungswesen    ✓
  🟢 Thema 5 — Personal          ✓

Diagnose-Timeline:
  Punkte für jeden Diagnose-Zeitpunkt
  Klick → zeigt Radar dieses Datums
```

---

## KI-Prompts (Azure OpenAI)

```javascript
const prompts = {

  aufgabe: (thema, typ, schwierigkeit) =>
    `Du bist Lernassistent für Physik (FH Aachen).
     Generiere eine ${typ}-Aufgabe für "${thema}".
     Schwierigkeitsgrad ${schwierigkeit} von 3.
     Nur die Aufgabenstellung, kein Präambel.`,

  tipp: (aufgabe, nr) =>
    `Aufgabe: "${aufgabe}"
     Gib Tipp ${nr} von 3.
     Tipp 1=abstrakte Denkrichtung, 2=konkreter Hinweis, 3=fast vollständig.
     Max 2 Sätze, kein Präambel.`,

  bewertung: (aufgabe, antwort, thema) =>
    `Thema: "${thema}" — Physik FH Aachen.
     Aufgabe: "${aufgabe}"
     Antwort: "${antwort}"
     Kurzes Feedback (max 3 Sätze): was war gut, was fehlt.
     Direkt beginnen, kein Präambel.`,

  lernziele: (thema) =>
    `3 konkrete Lernziele für "${thema}" in Physik FH Aachen.
     Format: Stichpunkte, max 1 Satz pro Ziel. Kein Präambel.`,

  empfehlung: (staerken) =>
    `Studierende hat Stärken in: ${staerken}.
     Empfehle in 1-2 Sätzen welches Thema sie als Expertin übernehmen soll.
     Freundlich und direkt.`,

  frageAntwort: (frage, kurs) =>
    `Du bist Tutor für "${kurs}".
     Beantworte diese Frage präzise und verständlich (max 4 Sätze):
     "${frage}"`
}
```

---

## Mock-Antworten (Fallback ohne API Key)

```javascript
const mockResponses = {
  empfehlung: "Du kennst Rechnungswesen am besten — werde Expertin dafür! Deine Gruppe braucht genau dein Wissen.",
  lernziele: "• Grundbegriffe der Kostenrechnung erklären können\n• Unterschied zwischen fixen und variablen Kosten darstellen\n• Trägheitsmoment anwenden",
  aufgabe: "Erkläre in eigenen Worten den Unterschied zwischen Impulserhaltungssatz und Energieerhaltungssatz und nenne je ein Beispiel.",
  tipp1: "Denk daran, wofür ein Unternehmen die beiden Systeme jeweils einsetzt.",
  tipp2: "Kostenrechnung schaut auf das, was ein Unternehmen ausgibt — Leistungsrechnung auf das, was es erbringt.",
  tipp3: "Die Kostenrechnung erfasst interne Kosten für Produkte und Prozesse. Die Leistungsrechnung bewertet die erbrachten Leistungen und deren wirtschaftlichen Wert.",
  bewertung: "Gut erklärt! Du hast den wesentlichen Unterschied korrekt benannt. Noch besser wäre ein konkretes Praxisbeispiel.",
  frageAntwort: "Das ist eine gute Frage. Die Trägheitsmoment zeigt, wie viel ein Produkt zur Deckung der Fixkosten beiträgt — nicht den Gewinn direkt."
}
```

---

## Build-Reihenfolge

**Prototyp A — Gruppe (ca. 6 Schritte):**
1. Grundstruktur + Navigation + Design System + CDN-Imports
2. Setup-Screen + Azure API Config + LocalStorage
3. Demo-Daten (Kurs + 3 simulierte Mitglieder)
4. Home + Fortschrittsanzeige
5. Selbstdiagnose + RadarChart + KI-Empfehlung
6. Gruppen-Dashboard + Lernvertrag + Anonyme Fragen

**Prototyp B — Solo (ca. 8 Schritte):**
1. Grundstruktur + Navigation + Design System + CDN-Imports
2. Setup-Screen + Azure API Config + LocalStorage
3. Demo-Daten (Kurs)
4. Home + Fortschrittsanzeige
5. Selbstdiagnose + RadarChart mit Verlauf
6. Wissensüberprüfung: Erklären + Tipp-System ← PRIORITÄT
7. Fehler-Finden-Aufgabe
8. Adaptives System + Fortschritts-Timeline

---

## Wichtige Hinweise

- API Key **niemals** im Quellcode — immer aus LocalStorage
- Fallback Mock-Antworten wenn kein Key vorhanden
- LocalStorage Präfix `mlk_` für alle Keys
- Kein user_id bei anonymen Fragen — technisch sicherstellen
- Mobile-first — 375px Basis-Breakpoint
- Reset-Button im letzten Screen — löscht alle `mlk_`-Daten
- Prototypen sind unabhängig — keine gemeinsame Datenbasis
