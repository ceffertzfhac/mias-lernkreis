# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **Design Thinking + KI (AI) project** documentation repository for **madelconsulting** — a boutique consultancy focused on user-centered innovation and digitalization. There is no source code — the repository holds structured documentation, prompt templates, research artifacts, and KI usage logs.

**Active project context:** Neugestaltung der Prüfungsvorbereitung in der Physiklehre an Fachhochschulen. Kern-Challenge: Reduktion von Unsicherheiten bzgl. Prüfungsrelevanz, Lernmethodik und Quellenqualität. Team hat mittlere KI-Affinität; Budget beschränkt auf kostenlose Tools; keine sensiblen Daten, Cloud-Tools erlaubt.

**Aktueller Lösungsansatz:** „Mias Lernkreis" — ein soziales Lernbegleitsystem (Prototype-Phase, HTML-Prototyp vorhanden: `05_prototype/mias-lernkreis.html`).

## Core Documents

- `UEBERSICHT.md` — Zentrale Projektdokumentation mit Platzhaltern für alle DT-Phasen, Prompt-Protokoll und Decision Log. Platzhalter (`_…_`) werden im Projektverlauf befüllt.
- `KI-Tools-DT-Phasen.md` — KI-Tool-Empfehlungen strukturiert nach DT-Phasen, spezifisch für den FH-Physik-Kontext.
- `notes/DT_KI_Tools_Uebersicht.md` — Umfassende Übersicht aller KI-Tools über alle 6 Phasen mit Top-3-Empfehlungen pro Use Case.
- `GEMINI.md` — Parallele Guidance-Datei für Gemini (ähnlicher Inhalt, anderer Stil).

## Design Thinking Phases

The project follows **6 DT phases**: Verstehen → Beobachten → POV (Point of View) → Ideen → Prototype → Testing. The `UEBERSICHT.md` template uses slightly compressed phase names (Empathize/Define/Ideate/Prototype/Test); always apply the full 6-phase model when creating new artifacts.

## Folder Structure & Artifact Locations

Artifacts are organized in numbered phase folders:

| Ordner | Inhalt |
|:---|:---|
| `01_understand/` | Interview-Leitfaden, Interview-Transkripte (Fabian, Jana) |
| `02_observe/` | Forschungsrahmen, Hypothesen, Personas (Fabian, Jana; Mia als PPTX) |
| `03_define/` | WKW-Fragen (Wie Können Wir = HMW), Prioritisierungen |
| `04_ideate/` | Ideen-Cluster, MoSCoW-Analyse, Top-Ideen-Tabellen, Idea Napkin |
| `05_prototype/` | Lean Canvas, Lernjourney, HTML-Prototyp, Prompts für Lovable/Claude Code, Napkin Canvas, Morphologische Analyse |
| `06_test/` | (noch leer) |
| `Input/` | KI-Assistenten Rollen-Prompts (Stellenbeschreibungen) |
| `assets/` | Bilder (KI-generiert via Gemini, Fotos) |
| `notes/` | Tool-Übersichten, allgemeine Notizen |

## Role Prompts (KI-Assistenten Stellenbeschreibungen)

Role prompts define personas for AI assistants used in the project. Two formats exist:

1. **Simple format** (as in `05_prototype/rolle.md`): Markdown sections `#Deine Rolle`, `#Meine Rolle`, `#Der Kontext`, `#Deine Aufgabe`, `#Output`, `#Nachfragen` — use for quick one-off prompts.
2. **XML format** (templates in `Input/`): `<Stellenbeschreibung>` with `<Rolle>`, `<Organisation>`, `<Aufgaben>`, `<Wichtige Hinweise>` blocks — use for reusable, formally documented personas.

## Working Guidelines

- **Kontext prüfen:** Vor neuen Vorschlägen sicherstellen, dass sie zu den bestehenden Hypothesen (`02_observe/Forschungsrahmen_Hypothesen.md`) und den drei Personas passen.
- **UEBERSICHT.md pflegen:** Bei wichtigen Änderungen oder neuen Phasen-Ergebnissen das Decision Log und Prompt-Protokoll in `UEBERSICHT.md` aktualisieren.
- **Dateiformate:** Strukturierte Inhalte → Markdown (`.md`); Präsentationen/Canvas → PowerPoint (`.pptx`); Web-Prototypen → HTML (`.html`); Visualisierungen → `.png`/`.jpg`.

## Language

All project documentation is in **German**. Maintain German when editing existing documents or adding new content unless the user explicitly requests otherwise.
