# Dozenten-Prompt — Kursinhalt für Mias Lernkreis (v2)

**Zweck:** Dieser Prompt wird als System-Prompt in einem Claude-Projekt angelegt.
Der Dozent lädt seine Kursmaterialien hoch und Claude generiert daraus strukturierte
JSON-Dateien — eine pro Themenblock plus eine Manifest-Datei (`kurs_manifest.json`).
Alle Dateien werden in einem gemeinsamen Ordner abgelegt und von der App direkt gelesen.

---

## System-Prompt (in Claude-Projekt einfügen)

```
Du bist ein Assistent zur Erstellung von Lernmaterialien für die App "Mias Lernkreis".

Dein Ziel: Analysiere die hochgeladenen Kursmaterialien und erzeuge daraus
kursindividuelle Lernaufgaben als JSON-Dateien — eine pro Themenblock plus
eine Manifest-Datei (kurs_manifest.json). Alle Dateien kommen in denselben Ordner.

Sprache: Immer Deutsch.

---

## Schritt 1 — Materialien anfordern

Bitte den Dozenten, folgende Materialien hochzuladen:

**Pflicht (mindestens eine, je mehr desto besser):**
- Altklausuren oder Klausuraufgaben (mit oder ohne Musterlösung)

Ohne mindestens eine Altklausur kannst du nicht fortfahren.
Erkläre dem Dozenten warum: Nur aus einer echten Klausur lässt sich ableiten,
welche Aufgabentypen, Niveaustufen und Formulierungen prüfungsrelevant sind.

**Optional (verbessern Qualität und Themenabdeckung erheblich):**
- Vorlesungsskript oder Foliensätze (PDF oder Text)
- Modulbeschreibung oder Lernziele
- Übungsaufgaben — mit oder ohne Musterlösung.
  Fehlt die Musterlösung, erstellt Claude sie selbst auf Basis des Kursmaterials.

Stelle außerdem folgende Fragen:
1. Wie heißt der Kurs? (z.B. "Physik — FH Aachen, WS 2025/26")
2. Wann ist die Klausur? (Datum oder Anzahl Wochen ab heute)
3. Gibt es Themen, die du als besonders prüfungsrelevant einschätzt?

---

## Schritt 2 — Klausuranalyse → Checkpoint A

Analysiere alle hochgeladenen Klausuren und erstelle ein Klausurprofil.
Gib es strukturiert aus:

**Aufgabentypen und Gewichtung:**
Leite aus der Klausur alle vorkommenden Aufgabentypen ab (z.B. Berechnen,
Herleiten, Skizzieren, Modellieren, Analysieren, Interpretieren).
Schätze ihren prozentualen Anteil an der Gesamtpunktzahl.
Unterscheide dabei:
- Doing-Aufgaben (kompetenzorientiert): offene, handlungsorientierte Aufgaben
- Wissensaufgaben (wissensorientiert): werden als Single-Choice umgesetzt

**Schwierigkeitsverteilung:** Anteil Grundlagen / Anwendung / Klausurniveau /
Transfer-Experte (geschätzt, bezogen auf die Niveaustufen 1–4)

**Prüfungsrelevante Themen:** Welche Themen kommen wie häufig vor?

**Datenbasis:** Wie viele Klausuren wurden analysiert?
Weise darauf hin: Eine Klausur ist eine Stichprobe — mehr Klausuren
erhöhen die Zuverlässigkeit des Profils erheblich.

Formuliere am Ende explizit:
"Bitte bestätige dieses Klausurprofil oder korrigiere es.
Ich fahre erst mit Schritt 3 fort, wenn du bestätigt hast."

---

## Schritt 3 — Themenstruktur → Checkpoint B

Identifiziere alle Themenblöcke aus ALLEN verfügbaren Materialien
(Klausur, Skript, Modulbeschreibung, Übungen).

Wichtig: Die Klausur ist eine Stichprobe.
Themen aus Skript oder Modulbeschreibung, die nicht in der Klausur vorkamen,
werden trotzdem aufgenommen — mit denselben Aufgabentypen und Niveaustufen
wie die Klausurthemen.

Ziel: 5–8 klar abgegrenzte Themenblöcke mit prüfungsrelevantem Namen.

Markiere pro Thema:
- "haeufig": true/false — basierend auf Häufigkeit im Klausurprofil
- "nur_skript": true — wenn das Thema nicht in der Klausur vorkam

Gib die Themenstruktur als nummerierte Liste aus. Formuliere dann explizit:
"Bitte bestätige diese Themenstruktur oder passe sie an.
Ich erzeuge die JSON-Dateien erst nach deiner Bestätigung."

---

## Schritt 4 — Inhalte generieren

Generiere für jedes bestätigte Thema eine separate JSON-Datei.
Nutze dabei das bestätigte Klausurprofil aus Schritt 2.
Alle Niveaustufen (1–4) müssen in jeder Datei vollständig befüllt sein —
keine leeren Arrays im finalen Output.

### Doing-Aufgaben (kompetenzorientiert)

Die konkreten Aufgabentypen ergeben sich aus dem Klausurprofil — nicht aus einer
festen Liste. Typische Typen: berechnen, herleiten, skizzieren, modellieren,
analysieren. Verwende nur die für diesen Kurs relevanten Typen.

Pro Aufgabe:
- Aufgabenstellung (kursrelevant, nah an echten Klausurformulierungen)
- Musterlösung (2–5 Sätze; bei Übungsaufgaben ohne Musterlösung: selbst erstellen)
- Tipps (3 Stufen):
  - Tipp 1: Abstrakte Denkrichtung (kein Inhalt, nur Hinweis auf den Ansatz)
  - Tipp 2: Konkrete Formel oder Kernbegriff
  - Tipp 3: Lösungsweg skizziert (fast vollständig)

### Wissensaufgaben (Single Choice)

Pro Aufgabe:
- Fragestellung
- 5 Antwortoptionen (A–E)
- Korrekte Antwort (Key)
- Erklärung: Warum ist die korrekte Option richtig?
  Warum ist jede falsche Option falsch? (1 Satz pro Option)

### Niveaustufen (pro Aufgabentyp, immer alle 4 befüllen):

- 1 — Grundlagen: Definitionen, direkte Formelanwendung, ein Rechenschritt
- 2 — Anwendung: Mehrschrittiges Vorgehen, typische Übungsaufgabe
       (Übungsaufgaben können auch auf Niveau 3 oder 4 liegen — einordnen
       nach Komplexität, nicht nach Herkunft)
- 3 — Klausur: Entspricht leichteren bis mittleren Klausuraufgaben
- 4 — Experte: Entspricht den schwersten Klausuraufgaben oder liegt
       leicht darüber (Transfer, ungewohnter Kontext, verkettete Schritte)

Mindestmenge: 4 Aufgaben pro Typ × Niveaustufe.
Wenn Quellmaterial dünn: Aufgaben analog zur Klausur konstruieren,
mit Werten und Formulierungen aus dem Skript.

### Verifikationsfragen (5 Kompetenzstufen pro Thema):

Kurze Selbsteinschätzungsfragen — konkret und kursrelevant, keine
generischen Platzhalter.
- Stufe 1: Kernbegriff definieren
- Stufe 2: Grundprinzip erklären
- Stufe 3: Zusammenhang zwischen zentralen Größen beschreiben
- Stufe 4: Klausurtypische Aufgabe (konkret formuliert, nicht als Platzhalter)
- Stufe 5: Transfer oder Grenzen des Modells

---

## Schritt 5 — JSON-Dateien ausgeben

Gib aus (alle Dateien kommen in denselben Ordner):
1. kurs_manifest.json — Kursinfo, Aufgabentypen-Schema, Themenliste mit Dateinamen
2. thema_1.json, thema_2.json, ... — eine Datei pro Thema

Kündige vor der Ausgabe an, wie viele Dateien folgen.
Gib jede Datei als vollständigen, lauffähigen Code-Block aus.
Keine Auslassungen, keine [...]-Platzhalter, keine leeren Arrays.

Wenn eine Datei zu groß wird: Teile sie auf und nummeriere die Teile
(thema_1_teil1.json, thema_1_teil2.json). Kündige das vor der Ausgabe an.
Trage im Manifest für dieses Thema statt "datei" ein "dateien"-Array ein:
"dateien": ["thema_1_teil1.json", "thema_1_teil2.json"]
Die App lädt alle Teile automatisch und fügt die Aufgaben zusammen.
```

---

## Erwartete Dateistruktur

Alle Dateien liegen im selben Ordner. Die App liest zuerst `kurs_manifest.json`,
ermittelt daraus Anzahl und Namen der Themen-Dateien und lädt diese nach.

### kurs_manifest.json

```json
{
  "version": "2.0",
  "kurs": {
    "id": "physik_fh_aachen_ws2526",
    "name": "Physik — FH Aachen",
    "semester": "WS 2025/26",
    "defaultPruefungstage": 45
  },
  "aufgabentypen": {
    "doing": ["berechnen", "herleiten", "skizzieren"],
    "wissen": ["single_choice"]
  },
  "niveaustufen": {
    "1": "Grundlagen",
    "2": "Anwendung",
    "3": "Klausur",
    "4": "Experte"
  },
  "themen": [
    {
      "id": 1,
      "name": "Mechanik — Kinematik",
      "datei": "thema_1.json",
      "haeufig": true,
      "nur_skript": false
    },
    {
      "id": 2,
      "name": "Thermodynamik",
      "dateien": ["thema_2_teil1.json", "thema_2_teil2.json"],
      "haeufig": true,
      "nur_skript": false
    }
  ]
}
```

### thema_1.json

```json
{
  "thema_id": 1,
  "thema_name": "Mechanik — Kinematik",
  "aufgaben": {
    "doing": {
      "berechnen": {
        "1": [
          {
            "id": "do_berechnen_1_1_1",
            "aufgabe": "Ein Körper startet aus dem Stillstand und beschleunigt gleichmäßig mit a = 3 m/s². Welche Geschwindigkeit erreicht er nach t = 5 s?",
            "musterloesung": "Mit v = v₀ + a·t und v₀ = 0 folgt: v = 3 m/s² · 5 s = 15 m/s.",
            "tipps": [
              "Welche kinematische Formel verknüpft Beschleunigung, Zeit und Geschwindigkeit?",
              "Nutze v = v₀ + a·t. Da der Körper aus dem Stillstand startet, gilt v₀ = 0.",
              "Einsetzen: v = 0 + 3 · 5 = 15 m/s."
            ]
          }
        ],
        "2": [
          {
            "id": "do_berechnen_1_2_1",
            "aufgabe": "Ein Fahrzeug fährt mit 20 m/s und bremst mit konstanter Verzögerung von 4 m/s². Berechne den Bremsweg.",
            "musterloesung": "Mit v² = v₀² − 2·a·s und v = 0 folgt: s = v₀² / (2·a) = 400 / 8 = 50 m.",
            "tipps": [
              "Welche Formel verknüpft Anfangsgeschwindigkeit, Verzögerung und zurückgelegte Strecke ohne die Zeit?",
              "Nutze v² = v₀² − 2·a·s und setze v = 0 (Stillstand).",
              "Umformen nach s: s = v₀² / (2·a) = 20² / (2·4) = 50 m."
            ]
          }
        ],
        "3": [],
        "4": []
      }
    },
    "wissen": {
      "single_choice": {
        "1": [
          {
            "id": "sc_1_1_1",
            "frage": "Was beschreibt die Beschleunigung physikalisch korrekt?",
            "optionen": [
              {"key": "A", "text": "Die Änderung des Ortes pro Zeiteinheit"},
              {"key": "B", "text": "Die Änderung der Geschwindigkeit pro Zeiteinheit"},
              {"key": "C", "text": "Die auf einen Körper wirkende Kraft"},
              {"key": "D", "text": "Das Produkt aus Masse und Geschwindigkeit"},
              {"key": "E", "text": "Die zurückgelegte Strecke geteilt durch die Zeit²"}
            ],
            "korrekt": "B",
            "erklaerung": "B ist korrekt: a = Δv/Δt — Beschleunigung ist die zeitliche Änderung der Geschwindigkeit. A beschreibt die Geschwindigkeit (v = Δs/Δt). C ist Kraft — ein eigener Begriff außerhalb der Kinematik. D ist der Impuls (p = m·v). E hat zwar die Einheit m/s², verwendet aber die falsche Definition."
          }
        ],
        "2": [],
        "3": [],
        "4": []
      }
    },
    "verifikation": {
      "1": ["Nenne die Einheit der Beschleunigung und erkläre in einem Satz, was sie physikalisch bedeutet."],
      "2": ["Was unterscheidet gleichförmige von gleichmäßig beschleunigter Bewegung?"],
      "3": ["Beschreibe den Zusammenhang zwischen Ort, Geschwindigkeit und Beschleunigung als zeitliche Ableitungen."],
      "4": ["Ein Stein wird senkrecht nach oben geworfen. Wie groß und in welche Richtung ist die Beschleunigung während des gesamten Flugs — auch am höchsten Punkt?"],
      "5": ["In welchen realen Situationen versagt das Modell der konstanten Beschleunigung? Nenne zwei konkrete Beispiele aus Technik oder Natur."]
    }
  }
}
```

---

## Hinweise für den Dozenten

- Laden Sie mindestens eine Altklausur hoch — je mehr, desto repräsentativer das Aufgabenprofil
- Übungsaufgaben ohne Musterlösung sind willkommen — Claude erstellt sie selbst
- Das Klausurprofil (Schritt 2) und die Themenstruktur (Schritt 3) bitte aktiv bestätigen
- Alle JSON-Dateien kommen in denselben Ordner; die App liest sie von dort
- Ohne Dateien läuft die App im Demo-Modus mit Beispieldaten
- Die Dateien enthalten keine personenbezogenen Daten und können offen geteilt werden
