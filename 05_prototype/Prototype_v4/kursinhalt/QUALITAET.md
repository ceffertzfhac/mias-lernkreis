# Qualitätsmanifest — Mias Lernkreis Aufgaben

Dieses Manifest definiert verbindliche Qualitätsanforderungen für alle Aufgaben
in der App. Es gilt für die Erstellung (Dozenten-Prompt) und die Qualitätssicherung
(Review neuer Batches).

---

## 1. Typentreue (k.o.-Kriterium)

Jede Aufgabe trägt genau einen Typ. Der Typ ist nicht verhandelbar:

| Merkmal | `berechnen` | `single_choice` |
|---|---|---|
| Zahlenwerte mit Einheit zwingend | ✅ ja | ❌ nein |
| Taschenrechner notwendig | ✅ ja | ❌ nein |
| Antwort ist eine Zahl | ✅ ja | ❌ nein |
| Antwort ist eine Aussage / ein Begriff | ❌ nein | ✅ ja |

**Test:** Kann die Aufgabe ohne Taschenrechner beantwortet werden?
→ Dann gehört sie in `single_choice`, egal wie schwierig sie konzeptionell ist.

Eine Aufgabe im falschen Typ ist ungültig und muss neu geschrieben werden.

---

## 2. Sprachliche Qualität — Rechenaufgaben (berechnen)

Dies ist das wichtigste Qualitätskriterium. Rechenaufgaben orientieren sich
**sprachlich an echten Klausuraufgaben**: vollständige Sätze, klare Szenenbeschreibung,
präzise Angabe aller gegebenen Größen.

### Pflichtregeln

- **Vollständige Sätze** — keine Stichwortketten, keine Klammerketten als Ersatz für Sätze
- **Szenenbeschreibung zuerst** — was passiert physikalisch, bevor Zahlenwerte genannt werden
- **Zahlenwerte eingebettet** — nicht isoliert in Klammern, sondern im Satz
- **Explizite Fragestellung** — was genau soll berechnet werden (Formelzeichen + Einheit nennen)
- **Klausursprache** — so wie es auf dem Klausurblatt stehen würde
- **Dezimalkomma** — 3,14 nicht 3.14
- **Signifikante Stellen** — wie im Kurs üblich (in der Regel 3)
- **Physikalische Symbole** korrekt gesetzt (v₀, α, μ, ω — keine ASCII-Behelfslösung)

### Gegenbeispiele — SO NICHT

❌ **Schlechtes Beispiel (Telegrammstil):**
> Skifahrer (m = 75 kg, Hang α = 30°): x(t) = 1,2t² + 9,8t. Nach welcher Zeit 120 m? Wie groß ist v?

❌ **Schlechtes Beispiel (Stichwortkette):**
> Zwei Blöcke (m₁ = 5 kg auf Ebene α = 25°, μ = 0,15; m₂ = 3 kg hängend) über Seil und Rolle. Berechne a und T.

❌ **Schlechtes Beispiel (fehlende Fragestellung):**
> Ein Körper (v₀ = 4,0 m/s, a = 3,0 m/s²) — nach welcher Zeit hat er s = 50 m zurückgelegt?

### Vorbildbeispiele — SO JA

✅ **Gutes Beispiel (N3):**
> Ein Skifahrer der Masse m = 75 kg fährt einen Hang mit dem Neigungswinkel α = 30° hinunter.
> Seine Position in Abhängigkeit von der Zeit ist durch x(t) = 1,2 t² + 9,8 t beschrieben,
> wobei x in Metern und t in Sekunden angegeben ist.
> (a) Nach welcher Zeit hat der Skifahrer eine Strecke von s = 120 m zurückgelegt?
> (b) Welche Geschwindigkeit v hat er zu diesem Zeitpunkt?

✅ **Gutes Beispiel (N2):**
> Zwei Blöcke sind über ein masseloses Seil und eine reibungsfreie Umlenkrolle
> miteinander verbunden. Block 1 der Masse m₁ = 5,0 kg liegt auf einer schiefen Ebene
> mit dem Neigungswinkel α = 25° und dem Gleitreibungskoeffizienten μ = 0,15.
> Block 2 der Masse m₂ = 3,0 kg hängt senkrecht. (g = 9,81 m/s²)
> Berechnen Sie die Beschleunigung a des Systems sowie die Seilspannung T.

✅ **Gutes Beispiel (N1):**
> Ein Körper startet aus der Ruhe und wird gleichmäßig mit der Beschleunigung
> a = 3,0 m/s² beschleunigt.
> Welche Geschwindigkeit v hat der Körper nach t = 5,0 s?

### Musterlösung (berechnen)

Vollständiger Lösungsweg in der Reihenfolge:
1. **Gegeben:** alle gegebenen Größen mit Symbol und Einheit
2. **Gesucht:** gesuchte Größe mit Symbol und Einheit
3. **Ansatz:** verwendete Formel in Formelzeichen
4. **Einsetzen:** numerischer Wert mit Einheiten
5. **Ergebnis:** Zahl mit Einheit, korrekte Anzahl signifikanter Stellen

Zwischenschritte bei N3/N4 vollständig angeben — kein Schritt darf übersprungen werden,
der für Studierende auf diesem Niveau nicht trivial ist.

### Tipps (3-Stufen-Regel, berechnen)

| Tipp | Inhalt | Verboten |
|---|---|---|
| Tipp 1 | Abstrakte Denkrichtung — welche Formelkategorie hilft? | Formel, Zahl, Einsetzen |
| Tipp 2 | Zentrale Formel in Formelzeichen | Einsetzen, Zwischenergebnis |
| Tipp 3 | Lösungsweg vollständig skizziert | Nur das numerische Ergebnis fehlt |

Wer alle 3 Tipps gelesen hat, muss die Aufgabe lösen können.
Wer nur Tipp 1 gelesen hat, weiß noch nichts Konkretes.

---

## 3. Sprachliche Qualität — Wissensaufgaben (single_choice)

- Fragestellung als vollständiger Satz formuliert
- Präzise und eindeutig — keine doppelten Verneinungen, kein Fachjargon
  der im Kurs nicht eingeführt wurde
- Optionen parallel formuliert (alle als Substantivphrase oder alle als Satz — nicht gemischt)
- Jede Option ist sprachlich vollständig und grammatikalisch korrekt

---

## 4. Distraktoren (single_choice — 5-Optionen-Regel)

- Genau **1 korrekte** Option (keine Diskussionsfälle, keine "am ehesten richtig"-Formulierungen)
- **4 Distraktoren**, davon:
  - mind. 2 aus realen, dokumentierten Denkfehlern von Studierenden abgeleitet
  - mind. 1 "fast richtig" — korrekter Begriff, falscher Kontext oder umgekehrte Kausalität
  - keine Option, die durch reines Ausschlussverfahren ohne Fachwissen eliminierbar ist
- **Erklärung:** für jede der 5 Optionen ein Satz — richtig weil / falsch weil

---

## 5. Prüfungsrelevanz

- Formulierungen, Zahlenwerte und Szenarien orientieren sich an echten Klausuren des Kurses
- Kein akademischer Lehrbuchjargon, der im Kurs nicht eingeführt wurde
- Schwierigkeitsgrad entspricht dem deklarierten Niveau nach **Komplexität der Lösung**,
  nicht nach Herkunft (eine Übungsaufgabe kann N3 sein, eine Klausuraufgabe kann N1 sein)

| Niveau | Charakteristik berechnen | Charakteristik single_choice |
|---|---|---|
| N1 | 1 Formel, 1 Rechenschritt, direkt einsetzen | Kernbegriff definieren, klare Abgrenzung |
| N2 | 2–3 Schritte, Einheitenumrechnung oder Umstellen | Zusammenhang zwischen zwei Größen |
| N3 | Mehrstufig, Fallunterscheidung oder Vektorkomponenten | Klausurtypische Falle, häufiger Denkfehler |
| N4 | Verkettete Schritte, Transfer, ungewohnter Kontext | Grenzfall, Modellkritik, Transfer |

---

## 6. Abwechslung im Pool

- Innerhalb einer Datei (`niveau_N.json`) kein identisches Szenario zweimal
  (nicht 4× fallender Stein, nicht 4× Auto bremst)
- Verschiedene Formelkonstellationen pro Datei (wenn möglich)
- Bei single_choice: korrekte Antwort nicht immer derselbe Buchstabe

---

## 7. Vollständigkeit (Pflichtfelder)

| Feld | berechnen | single_choice | grafisch_auswerten |
|---|---|---|---|
| `id` | ✅ | ✅ | ✅ |
| `aufgabe` / `frage` | ✅ | ✅ | ✅ |
| `musterloesung` | ✅ | — | ✅ |
| `tipps` (genau 3) | ✅ | — | ✅ |
| `optionen` (genau 5) | — | ✅ | — |
| `korrekt` (A–E) | — | ✅ | — |
| `erklaerung` | — | ✅ | — |

Eine Aufgabe mit leerem Pflichtfeld ist unvollständig und darf nicht in den Pool.

---

## Review-Checkliste

Bei jedem neuen Aufgaben-Batch diese Checkliste durchlaufen:

**Typentreue**
- [ ] Alle berechnen-Aufgaben erfordern einen Taschenrechner
- [ ] Keine single_choice-Aufgabe enthält Zahlenwerte als Kernelement

**Sprache berechnen**
- [ ] Vollständige Sätze (keine Stichwortketten)
- [ ] Szenenbeschreibung vor Zahlenwerten
- [ ] Explizite Fragestellung mit Formelzeichen und Einheit
- [ ] Dezimalkomma, korrekte Symbole (v₀, α, μ ...)

**Musterlösung**
- [ ] Gegeben / Gesucht / Ansatz / Einsetzen / Ergebnis vorhanden
- [ ] Einheit im Ergebnis
- [ ] Kein Schritt übersprungen (für das jeweilige Niveau)

**Tipps**
- [ ] Tipp 1 enthält keine Formel
- [ ] Tipp 3 enthält keinen fertigen Zahlenwert als Ergebnis

**Single Choice**
- [ ] Genau 1 korrekte Option (eindeutig)
- [ ] Erklärung für alle 5 Optionen vorhanden
- [ ] Mind. 2 Distraktoren aus realen Denkfehlern

**Pool**
- [ ] Kein doppeltes Szenario innerhalb einer niveau_N.json
- [ ] Mindestens 4 Aufgaben pro Datei
