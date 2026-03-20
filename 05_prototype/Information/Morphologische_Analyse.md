# Morphologische Analyse — Mias Lernkreis
**DTconsulting | Design Thinking Sprint | 2026**
**Status: Schritt 1 + 2 abgeschlossen — Variantenraum vollständig**

---

## Ziel dieses Dokuments

Mias Lernkreis ist eine erste Idee — keine festgelegte Lösung. Dieses Dokument spannt den Variantenraum auf: Welche Kernentscheidungen stecken in der Idee? Welche Alternativen gibt es pro Dimension? Ziel ist eine saubere Grundlage für spätere Produktentscheidungen und den Aufbau eines Product Backlogs.

---

## Referenz-Umsetzung — Variante 0

Die in Phase 5 entwickelte Ausgangsvariante. Wo *(Variante 0)* steht, entspricht diese Variante der aktuellen Umsetzungsidee.

- Solo Mode + Gruppen Mode
- Selbstdiagnose via Themen-Bewertung (grün/gelb/rot)
- Radar-Chart mit Zeitverlauf
- KI extrahiert Themen aus hochgeladenen Materialien
- Automatische Expertenauswahl via KI auf Basis des Profils
- Lernvertrag mit Thema, Rolle, Deadline
- Gemeinsames Q&A + anonyme Sprechstunde
- Fortschrittsanzeige: Zeit + Inhalt + kombiniertes Signal
- Studierende haben vollständige Datenkontrolle

---

## Übersicht aller Dimensionen

| # | Dimension | Kernfrage |
|---|---|---|
| 0 | Nutzungskontext | Einzel, Gruppe oder beides? |
| 1 | Gruppenbildung | Wie kommen Lernende zusammen? |
| 2 | Selbstdiagnose | Wie wird der eigene Wissensstand ermittelt? |
| 3 | Prüfungsrelevanz & Wissensquelle | Woher weiß die App was wichtig ist — und wer pflegt das Wissen ein? |
| 4 | Wissenstransfer | Wie wird Wissen in der Gruppe geteilt? |
| 5 | Feedback-Signal | Wie bekommt Mia Rückmeldung über ihren Fortschritt? |
| 6 | Anonymität & Hilfe | Wie bekommt Mia Unterstützung ohne Scham? |
| 7 | Motivation & Verbindlichkeit | Was hält Mia dabei? |
| 8 | Technologieeinsatz | Welche Rolle spielt KI? |
| 9 | Plattform & Hosting | Wo läuft die App? |
| 10 | Zugangshürde | Wer kann die App nutzen — und wie kommt man rein? |
| 11 | Persistenz | Lebt die App nur für eine Prüfung oder langfristig? |
| 12 | Datenhoheit | Wem gehören die Lern- und Profildaten? |
| 13 | Skalierung | Ein Kurs, eine Uni, hochschulübergreifend? |
| 14 | Einstiegspunkt | Wer initiiert die Nutzung? |
| 15 | Wissensüberprüfung | Wie wird Verstehen geprüft — jenseits von Single/Multiple Choice? |

---

## Varianten pro Dimension

---

### Dim 0 — Nutzungskontext
*Einzel, Gruppe oder beides?*

| Var | Beschreibung |
|---|---|
| A | Nur Einzellerner — vollständig solo, keine Gruppenfeatures |
| B | Nur Gruppen — funktioniert nur kollektiv, kein Solo-Modus |
| C | Beides — Solo und Gruppe als gleichwertige Modi *(Variante 0)* |
| D | Hybrid — startet solo, Gruppe entsteht organisch wenn andere den gleichen Kurs nutzen |

---

### Dim 1 — Gruppenbildung
*Wie kommen Lernende zusammen?*

| Var | Beschreibung |
|---|---|
| A | Manuell via Join-Code — Gruppe wird von einer Person erstellt, andere treten bei *(Variante 0)* |
| B | Automatisch via Kurs — alle Studierenden desselben Kurses landen automatisch in einer Gruppe |
| C | Algorithmus-basiert — System bildet Gruppen auf Basis von Profil-Komplementarität |
| D | Dozenten-initiiert — Dozent legt Gruppe an, Studierende werden eingeladen |
| E | Offen — jeder kann einer Kurs-Community beitreten ohne feste Gruppe |

---

### Dim 2 — Selbstdiagnose
*Wie wird der eigene Wissensstand ermittelt?*

| Var | Beschreibung |
|---|---|
| A | Selbsteinschätzung per Ampel (grün/gelb/rot) *(Variante 0)* |
| B | Multiple Choice / Single Choice Quiz |
| C | Erklären lassen (Freitext oder Voice) |
| D | Altklausuren lösen lassen |
| E | KI stellt Rückfragen (sokratischer Dialog) |
| F | Adaptives Aufgabensystem — Schwierigkeit passt sich dem Ergebnis an: richtig → nächste Stufe, falsch → einen Schritt zurück. Gilt als Prinzip für alle Varianten B–E. |

---

### Dim 3 — Prüfungsrelevanz & Wissensquelle
*Woher weiß die App was wichtig ist — und wer pflegt das Wissen ein?*

| Var | Beschreibung |
|---|---|
| A | KI extrahiert Themen aus Materialien die Studierende hochladen (Folien, Altklausuren, Modulbeschreibung) *(Variante 0)* |
| B | Dozenten laden Materialien direkt in die App — KI extrahiert daraus Themen und Gewichtung |
| C | Dozenten nutzen ein externes KI-Tool um strukturierte Inputdaten zu generieren — Export als Datei, Import in die App. Kein Plattformzwang. Händische Eingabe bleibt immer möglich. |

---

### Dim 4 — Wissenstransfer
*Wie wird Wissen in der Gruppe geteilt?*

| Var | Beschreibung |
|---|---|
| A | Themen-Spezialist erklärt live — Video, Chat oder Präsenz *(Variante 0 teilweise)* |
| B | Themen-Spezialist erstellt schriftliche Zusammenfassung *(Variante 0 teilweise)* |
| C | Themen-Spezialist erstellt kurzes Erklärvideo |
| D | Gemeinsames kuratiertes Lerntagebuch — nur Wissen, kein Panik-Kanal *(Variante 0)* |
| E | Peer-Review — Studierende bewerten gegenseitig ihre Erklärungen |

---

### Dim 5 — Feedback-Signal
*Wie bekommt Mia Rückmeldung über ihren Fortschritt?*

| Var | Beschreibung |
|---|---|
| A | Radar-Chart mit Zeitverlauf — visuell, nur eigener Vergleich *(Variante 0)* |
| B | Kombiniertes Signal: Zeitfortschritt vs. Lernfortschritt — bin ich im Zeitplan? *(Variante 0)* |
| C | KI gibt persönliches Feedback nach jeder Diagnose |
| D | Gruppen-Radar — Mia sieht ihr eigenes Profil UND den anonymen Gruppen-Durchschnitt (Summe und Schnitt, keine individuellen Fremdprofile sichtbar) |

---

### Dim 6 — Anonymität & Hilfe
*Wie bekommt Mia Unterstützung ohne Scham?*

| Var | Beschreibung |
|---|---|
| A | Anonyme Fragen-Sammlung in der Gruppe — kein user_id gespeichert *(Variante 0)* |
| B | Gebündelte Fragen anonym an Dozenten weitergeleitet *(Variante 0)* |
| C | Anonyme 1:1 Sprechstunde mit Dozent / Tutor *(Variante 0)* |
| D | KI beantwortet Fragen anonym und kontextbezogen |
| E | Peer-Antworten — Kommilitonen antworten anonym auf Fragen |
| F | Fragen werden anonym in höhere Semester weitergeleitet |
| G | Fragen-Routing — Gruppe entscheidet gemeinsam wohin eine Frage geht: KI / Dozent / Peer / Tutor. Mehrfachauswahl möglich. Fragen können aus der Gruppe gesammelt oder einzeln gepusht werden. |

---

### Dim 7 — Motivation & Verbindlichkeit
*Was hält Mia dabei?*

| Var | Beschreibung |
|---|---|
| A | Lernvertrag mit Deadline — soziale Verbindlichkeit gegenüber der Gruppe *(Variante 0)* |
| B | Streak / Lernkontinuität — tägliche Aktivität wird sichtbar gemacht |
| C | Gruppen-Fortschritt als kollektiver Anreiz — alle ziehen gemeinsam |
| D | Erinnerungen & Nudges — Push-Notifications bei nahenden Deadlines oder Inaktivität |
| E | Meilensteine & Completion-Animationen — Abschlüsse werden gefeiert *(Variante 0)* |
| F | Exam-Countdown als täglicher Anker — Prüfung ist immer sichtbar *(Variante 0)* |

---

### Dim 8 — Technologieeinsatz
*Welche Rolle spielt KI?*

| Var | Beschreibung |
|---|---|
| A | KI extrahiert Themen aus Dokumenten (Studierende laden hoch) *(Variante 0)* |
| B | KI generiert Aufgaben und Fragen aus Materialien |
| C | KI gibt persönliches Lernfeedback — sokratischer Dialog |
| D | KI beantwortet Fragen kontextbezogen — kennt den Kurs und die Materialien |
| E | KI nur auf Dozentenseite — Studierende-seitig kein KI-Einsatz, App läuft rein deterministisch nach klaren Regeln |

---

### Dim 9 — Plattform & Hosting
*Wo läuft die App?*

| Var | Beschreibung |
|---|---|
| A | Web-App — läuft im Browser, kein Download nötig *(Variante 0)* |
| B | Progressive Web App (PWA) — installierbar auf Homescreen, offline-fähig |
| C | Desktop-App — Download, läuft lokal |
| D | Standalone HTML — ohne Server, lokal ausführbar, maximale Datenschutz-Kontrolle |

---

### Dim 10 — Zugangshürde
*Wer kann die App nutzen — und wie kommt man rein?*

| Var | Beschreibung |
|---|---|
| A | Offener Zugang — jeder kann sich registrieren *(Variante 0)* |
| B | Hochschul-Login — SSO via Uni-Account, keine separate Registrierung |
| C | Invite-only — Einladung durch Dozenten oder Gruppe nötig |
| D | Kurs-Code als einzige Hürde — kein Account nötig, maximale Niedrigschwelligkeit |

---

### Dim 11 — Persistenz
*Lebt die App nur für eine Prüfung oder langfristig?*

| Var | Beschreibung |
|---|---|
| A | Einmalig pro Prüfung — danach wird nichts gespeichert, maximaler Datenschutz |
| B | Über das gesamte Studium — Lernprofil wächst mit, Entwicklung über Semester sichtbar *(Variante 0)* |

---

### Dim 12 — Datenhoheit
*Wem gehören die Lern- und Profildaten?*

| Var | Beschreibung |
|---|---|
| A | Studierende — vollständige Kontrolle, jederzeit löschbar *(Variante 0)* |
| B | Hochschule — Daten liegen auf Uni-Servern, DSGVO-konform |
| C | Lokal — Daten verlassen das Gerät nie. Sinnvoll insbesondere für Solo-Modus und Standalone-Variante. |
| D | Geteilt — Studierende entscheiden pro Datenpunkt was geteilt wird |

> **Designprinzip Gruppenlösung:** So datenschlank wie möglich operieren — nur speichern was für die Funktion zwingend nötig ist. Anonymität wo immer möglich. Keine Profilbildung über den Kurs hinaus.

---

### Dim 13 — Skalierung
*Ein Kurs, eine Uni, hochschulübergreifend?*

| Var | Beschreibung |
|---|---|
| A | Ein Kurs — geschlossene Einheit, kein Überblick über Kurse hinaus *(Variante 0)* |
| B | Eine Hochschule — alle Kurse einer Uni sichtbar und verwaltbar |
| C | Hochschulübergreifend — offene Plattform für alle Studierenden |
| D | Fachspezifisch — thematische Community z.B. nur BWL oder nur Informatik |

---

### Dim 14 — Einstiegspunkt
*Wer initiiert die Nutzung?*

| Var | Beschreibung |
|---|---|
| A | Studierende starten selbst — bottom-up, ohne institutionelle Unterstützung *(Variante 0)* |
| B | Dozenten initiieren — empfehlen oder verpflichten zur Nutzung |
| C | Fachschaft / Studierendenvertretung empfiehlt |
| D | Virales Wachstum — Studierende empfehlen es anderen |

---

### Dim 15 — Wissensüberprüfung
*Wie wird Verstehen geprüft — jenseits von Single/Multiple Choice?*

| Var | Beschreibung |
|---|---|
| A | Selbsteinschätzung + Kalibrierung — wie sicher bin ich? Abgleich mit tatsächlicher Aufgabenlösung *(Variante 0)* |
| B | Erklären lassen — Freitext oder Voice (Feynman-Prinzip) |
| C | Fehler finden — bewusst fehlerhafte Erklärung vorlegen, Studierende identifizieren den Fehler |
| D | Adaptives Aufgabensystem — Schwierigkeit steigt/sinkt je nach Ergebnis. Gilt als übergreifendes Prinzip für alle Varianten A–C. |

> **Übergreifendes Designprinzip — Tipp-System:**
> Jede Aufgabe in der App hat einen *"Gib mir einen Tipp"*-Button. Tipps werden aufsteigend konkreter: von einem allgemeinen Hinweis bis zur fast vollständigen Lösung. Jeder genutzte Tipp senkt die resultierende Kompetenzbewertung für dieses Thema. Mia kann sich helfen lassen — die Bewertung spiegelt ehrlich wider wie viel Unterstützung sie gebraucht hat. Gilt für alle Aufgabentypen.

---

## Nächste Schritte

- [ ] Variantenentscheidung: Welche Kombination wird zu Produkt 1.0?
- [ ] Oder: Variantenbaum aufbauen (2–3 kohärente Produktvarianten)
- [ ] Product Goal formulieren
- [ ] Epics aus WKW-Fragen ableiten
- [ ] Product Backlog aufbauen

---

## Prototypen-Entscheidungen

Getroffen am: 2026

### Prototyp A — Gruppen-Demo
*Ziel: Die soziale Journey von Mias Lernkreis demonstrieren — breit, nicht tief.*

| Dimension | Entscheidung | Variante |
|---|---|---|
| Nutzungskontext | Gruppen Mode | Dim 0 — B |
| Gruppenbildung | Name + PIN, kein Account | Dim 10 — D (vereinfacht) |
| Selbstdiagnose | Ampel (grün/gelb/rot) | Dim 2 — A |
| Wissenstransfer | Lernvertrag + Gruppenansicht | Dim 4 — A/B |
| Feedback-Signal | Radar + Gruppen-Durchschnitt | Dim 5 — A/D |
| Anonymität | Anonyme Fragen-Sammlung | Dim 6 — A |
| KI | KI Connect NRW (OpenAI-kompatibel) | Dim 8 — A |
| Plattform | Standalone HTML — lokal | Dim 9 — D |
| Persistenz | LocalStorage | Dim 11 — A |
| Testdaten | Fiktiver Demo-Kurs | — |

### Prototyp B — Solo + Wissensüberprüfung
*Ziel: Selbstdiagnose und Wissensüberprüfung tief ausarbeiten — ohne Gruppenfeatures.*

| Dimension | Entscheidung | Variante |
|---|---|---|
| Nutzungskontext | Solo Mode | Dim 0 — A |
| Zugangshürde | Name + PIN | Dim 10 — D (vereinfacht) |
| Selbstdiagnose | Ampel + Aufgaben + adaptiv | Dim 2 — A/F |
| Wissensüberprüfung | Erklären + Fehler finden + Tipp-System | Dim 15 — A/B/C/D |
| Feedback-Signal | Radar mit Zeitverlauf | Dim 5 — A/B |
| KI | KI Connect NRW (OpenAI-kompatibel) | Dim 8 — A/B/C |
| Plattform | Standalone HTML — lokal | Dim 9 — D |
| Persistenz | LocalStorage | Dim 11 — A |
| Testdaten | Fiktiver Demo-Kurs | — |

### Technische Randbedingung — FH Aachen Azure API
Der API Key der FH Aachen ist ein KI Connect NRW OpenAI-kompatibler Endpoint.
Endpoint-Format abweichend von Standard-OpenAI:
`https://chat.kiconnect.nrw/api/v1/chat/completions`
Standard Bearer-Token Auth — reiner fetch()-Call im HTML. Kein Azure-spezifisches Format.
