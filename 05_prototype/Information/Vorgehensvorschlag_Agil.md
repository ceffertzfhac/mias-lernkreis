# Vorgehensvorschlag — Von Design Thinking zu agilem Produktentwicklung
**DTconsulting | Design Thinking Sprint | 2026**

---

## Ausgangslage

Der Design Thinking Sprint ist inhaltlich abgeschlossen. Wir haben:

- Ein tiefes Nutzerverständnis (Mia, Jana, Fabian)
- Eine klare Challenge und drei WKW-Fragen
- Eine ausgearbeitete Produktidee (Mias Lernkreis)
- Eine vollständige Morphologische Analyse mit 16 Dimensionen und ~70 Varianten
- Eine MoSCoW-Priorisierung der Features
- Erste Entwicklungs-Prompts (Claude Code, Lovable)

Was noch fehlt: ein getesteter Prototyp und eine klare Produktentscheidung.

---

## Wie Design Thinking und Scrum zusammenspielen

Design Thinking und Scrum haben unterschiedliche Logiken — ergänzen sich aber ideal:

| Design Thinking | Scrum-Äquivalent |
|---|---|
| Challenge & WKW-Fragen | Product Vision & Goal |
| Persona (Mia) | User Story Protagonist |
| Top-Ideen | Epics |
| MoSCoW Must Have | Sprint 1 Backlog |
| Morphologische Varianten | Entscheidungspunkte im Backlog |
| Testen mit Nutzern | Sprint Review mit echten Usern |
| Iteration & Pivot | Sprint-Retrospektive & Backlog-Anpassung |

**Wichtig:** Scrum sollte erst starten wenn Phase 6 (Testen) zumindest einmal durchlaufen wurde. Ohne Testfeedback baut man auf Annahmen, nicht auf Erkenntnissen.

---

## Empfohlenes Vorgehen in 6 Schritten

---

### Schritt 1 — Design Thinking Phase 6 abschließen: Prototyp testen

**Was:** Mindestens einen validierten Durchlauf mit echten Studierenden.

**Wie:** Kein vollständiger Build nötig. Es reicht:
- Paper Prototype (ausgedruckte Screens, Mia klickt durch)
- Oder: Lovable / Claude Code MVP mit den 3 Kern-Screens (Selbstdiagnose, Radar, Gruppenansicht)

**Mit wem:** 3–5 Studierende vom Typ Mia (Gruppe 2 — Erfahrene mit schlechten Gewohnheiten)

**Was messen:**
- Versteht Mia den Einstieg ohne Erklärung?
- Macht die Selbstdiagnose für sie Sinn?
- Empfindet sie das Radar-Chart als ehrlich und nützlich?
- Würde sie die App wirklich in der Prüfungsphase nutzen?

**Output:** Liste von Erkenntnissen die direkt in den Backlog fließen.

---

### Schritt 2 — Variantenentscheidung aus der Morphologischen Analyse

**Was:** Aus den 16 Dimensionen eine kohärente Produktvariante für Version 1.0 definieren.

**Wie:** Zwei Optionen:

**Option A — Direkte Entscheidung:** Für jede Dimension eine Variante wählen → ergibt Produkt 1.0

**Option B — Variantenbaum:** 2–3 kohärente Produktvarianten definieren (z.B. "Minimale Solo-App" vs. "Gruppen-Plattform mit Dozenten") und dann eine davon als MVP priorisieren.

**Output:** Klare Festlegung welche Kombination gebaut wird.

---

### Schritt 3 — Product Vision & Product Goal formulieren

**Was:** Ein klarer, prägnanter Satz der das Produkt und seinen Zweck beschreibt.

**Format:**
> Für [Zielgruppe] die [Problem], ist [Produktname] ein [Produktkategorie] das [Kernnutzen]. Im Gegensatz zu [Alternative] bietet unser Produkt [Differenzierungsmerkmal].

**Beispiel (Entwurf):**
> Für Studierende die nicht wissen ob ihre Prüfungsvorbereitung reicht, ist Mias Lernkreis ein soziales Lernbegleitsystem das kontinuierliches Feedback und Orientierung während des Lernens gibt — nicht erst wenn die Note kommt.

**Output:** Product Vision Statement + Product Goal für ersten Release.

---

### Schritt 4 — Epics & erstes Product Backlog aufbauen

**Was:** Die WKW-Fragen und MoSCoW Must-Haves werden zu Epics und User Stories.

**Struktur:**

```
Epic 1 — Selbstdiagnose & Profil        (aus WKW 1)
Epic 2 — Soziales Lernen & Gruppe       (aus WKW 3)
Epic 3 — Lernqualität & Transfer        (aus WKW 5)
Epic 4 — Onboarding & Kurssetup
Epic 5 — Fortschrittsanzeige
Epic 6 — Anonyme Hilfe & Fragen
```

**User Story Format:**
> Als [Mia / Studierende] möchte ich [Aktion] damit ich [Nutzen].

**Acceptance Criteria:** Jede Story hat klare, testbare Kriterien.

**Output:** Priorisierter Product Backlog (Epics → Stories → Criteria).

---

### Schritt 5 — Sprint 0: Fundament legen

**Dauer:** 1 Woche

**Inhalt:**
- Tech Stack final entscheiden (React + Supabase + OpenAI / oder deterministisch)
- Supabase-Schema aufsetzen und migrieren
- Design System definieren (Farben, Typo, Komponenten)
- CI/CD Pipeline aufsetzen
- Entwicklungsumgebung für alle Beteiligten

**Kein Feature-Bau in Sprint 0.**

---

### Schritt 6 — Sprint 1–n: Iterativer Aufbau

**Rhythmus:** 2-Wochen-Sprints

**Sprint-Aufbau:**
- Sprint Planning (Backlog Refinement → Sprint Backlog)
- Daily Standup (optional bei kleinem Team)
- Sprint Review mit echten Studierenden (Mia-Typ)
- Retrospektive

**Priorität Sprint 1:**
- Onboarding + Kursanlage
- Selbstdiagnose + Radar-Chart

**Priorität Sprint 2:**
- Gruppenbildung + Lernvertrag
- Fortschrittsanzeige

**Priorität Sprint 3:**
- Anonyme Fragen + Routing
- Materialupload + KI-Extraktion

**Nach jedem Sprint:** Review-Feedback fließt direkt in den Backlog. Die Morphologische Analyse dient als Referenz wenn Varianten-Entscheidungen revidiert werden müssen.

---

## Entscheidungsbaum: Wann welche Variante?

Die Morphologische Analyse ist kein Archiv — sie ist ein aktives Dokument. Wenn im Laufe der Sprints eine Entscheidung revidiert wird (z.B. "wir bauen doch kein KI-Feedback"), wird das in der Morphologischen Analyse nachvollziehbar dokumentiert.

**Empfehlung:** Jede Varianten-Entscheidung mit Datum und Begründung versehen.

---

## Offene Entscheidungen vor Sprint 0

| Entscheidung | Optionen | Status |
|---|---|---|
| Solo oder Gruppe als MVP? | Dim 0: A, B, C oder D | offen |
| KI auf Studierendenseite? | Dim 8: A–D oder E (deterministisch) | offen |
| Plattform | Dim 9: Web / PWA / Desktop / HTML | offen |
| Zugangshürde | Dim 10: Offen / SSO / Code | offen |
| Persistenz | Dim 11: Pro Prüfung oder langfristig | offen |
| Prototyp testen | Phase 6 Design Thinking | ausständig |
