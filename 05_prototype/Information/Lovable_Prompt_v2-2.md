# Lovable Prompt — Mias Lernkreis (v2)
**DTconsulting | Design Thinking Sprint | 2026**

---

```
Build a web app called "Mias Lernkreis" — a social and personal learning 
companion for university students preparing for exams. The app guides 
students through structured exam preparation in 5 phases: self-diagnosis, 
expert assignment, learning contracts, shared Q&A, and anonymous tutoring.

TARGET USER: Mia, 22, BWL/Psychology student. Social learner who currently 
asks peers what to study instead of trusting her own judgment. She needs 
structure, clear signals about her progress, and support without shame.

---

DESIGN LANGUAGE:
- Clean, friendly, modern UI — warm off-white background (#F6F4FA)
- Primary: deep purple (#4A2C6E), accent: soft lavender (#7B4FA6)
- Rounded corners, generous white space, soft shadows
- Mobile-first but works on desktop
- Warm and approachable — like a study companion, not a corporate tool
- Typography: readable sans-serif, clear hierarchy
- Language: German throughout, "du" not "Sie"

---

MODE SELECTION — FIRST DECISION AFTER ONBOARDING

After entering name and course, the user chooses one of two modes:

SOLO MODE ("Ich lerne allein")
- Full self-diagnosis and progress tracking available
- No group features, no learning contracts
- Anonymous question collection still available (questions go to a 
  shared pool for the course, visible to all solo users of same course)
- Radar chart evolution over time fully available
- Exam date is personal
- Navigation: Home / Diagnose / Fragen / Fortschritt / Profil

GROUP MODE ("Ich lerne mit einer Gruppe")
- Full feature set including group dashboard, expert assignment, 
  learning contracts, and anonymous question collection
- User creates a group (6-character join code) or joins existing group
- All 5 phases of the journey are active
- Navigation: Home / Diagnose / Gruppe / Fragen / Profil

Both modes share the same self-diagnosis engine and radar chart system.
A solo user can upgrade to group mode at any time.

---

COURSE SETUP & MATERIAL UPLOAD

Immediately after mode selection, the user sets up their course:

Step 1 — Course basics:
- Course name (free text)
- Exam date (date picker)
- University / Hochschule (optional)

Step 2 — Material upload (optional but strongly encouraged):
Show three upload options with clear visual distinction:

  Option A: "Vorlesungsfolien / Skript hochladen" 
  (PDF, PPTX, DOCX — max 50MB)
  
  Option B: "Altklausuren hochladen" 
  (PDF — max 50MB, multiple files allowed)
  
  Option C: "Modulbeschreibung hochladen" 
  (PDF or paste text directly)
  
  User can upload multiple types at once.
  A "Jetzt überspringen" option is always visible.

Step 3 — AI processing (show loading screen with friendly copy):
  "Wir lesen deine Unterlagen und bereiten alles vor..."

PROCESSING LOGIC:
- If Modulbeschreibung only:
  → Extract topic list automatically from module description
  → Generate topic names for self-diagnosis
  → Learning contract fields remain EMPTY (user fills manually)
  → Show message: "Wir haben X Themen aus deiner Modulbeschreibung 
    erkannt. Den Lernplan kannst du selbst ergänzen."

- If Vorlesungsfolien or Skript uploaded:
  → Extract main topics and subtopics
  → Identify likely exam-relevant sections (headers, summaries, 
    highlighted content)
  → Pre-fill learning contract topics AND suggested learning content 
    per topic, as far as information is available
  → Clearly mark auto-generated content with a small "KI-Vorschlag" 
    badge so user knows what was extracted vs. what is certain

- If Altklausuren uploaded:
  → Extract recurring question topics and patterns
  → Weight topics by frequency of appearance in past exams
  → Add "Häufig geprüft" badge to high-frequency topics in 
    self-diagnosis and learning contract
  → Show insight: "Thema X kam in 3 von 4 Altklausuren vor"

- If multiple types uploaded:
  → Combine signals: module description for topic structure, 
    slides for content depth, old exams for priority weighting
  → Best possible pre-fill of all fields

IMPORTANT: All AI-generated content is clearly labeled and editable. 
User always has full control. Never present AI suggestions as definitive.

---

CORE FEATURES:

1. SELF-DIAGNOSIS (Phase 1)
- List of topics (from upload or manually added)
- For each topic: 3-option rating:
  "Ich kenne das gut" (green) / "Bin unsicher" (yellow) / 
  "Muss ich noch lernen" (red)
- If Altklausuren were uploaded: show "Häufig geprüft" badge next 
  to high-priority topics
- Result: personal radar/spider chart
- Profile is strictly private — only the user sees their own data
- After completing: automatic recommendation:
  "Du kennst Thema A am besten — werde Expertin dafür"

2. RADAR CHART — EVOLUTION OVER TIME
- Every completed self-diagnosis is saved as a timestamped snapshot
- The radar chart screen shows:
  a) Current state (most recent diagnosis)
  b) Toggle to "Verlauf anzeigen" — shows all snapshots as 
     semi-transparent overlapping charts (oldest faded, newest solid)
  c) A small timeline below the chart: dots for each diagnosis date, 
     clickable to view that snapshot
  d) A subtle animated transition when switching between snapshots
- Motivational copy when improvement is detected:
  "Du hast dich bei Thema B seit letzter Woche verbessert 🎉"
- Minimum interval between diagnoses: 24 hours 
  (prevent gaming, encourage real reflection)
- Suggested re-diagnosis: every 3-5 days, gentle reminder shown 
  on home screen

3. EXPERT ASSIGNMENT — GROUP MODE ONLY (Phase 2)
- Group view shows all members with assigned expert topics
- Jigsaw puzzle visual motif — each person is one piece
- Assignment is based on strongest topic from self-diagnosis
- Conflict resolution: if two members share the same strongest topic, 
  prompt them to negotiate
- Unassigned topics flagged in orange with call to action

4. LEARNING CONTRACT — GROUP MODE ONLY (Phase 3)
- Pre-filled from uploaded materials (where available), editable
- Fields: topic, what I will explain, deadline, format 
  (live session / written summary / video)
- Group dashboard shows all contracts with status indicators
- 3-day reminder before deadline
- Completion celebration: subtle confetti animation + 
  group notification "Mia hat Thema A erklärt 🎓"

5. ANONYMOUS QUESTION COLLECTION (Phase 4)
- Available in BOTH Solo and Group mode
- Submit questions — submitter identity never stored in database
- Questions grouped by topic
- Upvote system (+1) to surface most important questions
- Export: clean PDF list of top questions for sending to professor
- In group mode: group sees shared question pool
- In solo mode: questions go to a course-level anonymous pool

6. PERSONAL PROGRESS DASHBOARD (Home Screen)
- Current phase in journey
- Radar chart (latest snapshot + arrow showing trend)
- Active learning contract and countdown (group mode)
- Group progress (group mode) or personal streak (solo mode)
- Upcoming exam countdown
- Nudge when re-diagnosis is due

---

NAVIGATION:

Solo Mode:
  Home / Diagnose / Fragen / Fortschritt / Profil

Group Mode:
  Home / Diagnose / Gruppe / Fragen / Profil

---

SCREENS TO BUILD (priority order):
1. Landing / Mode selection
2. Course setup + material upload + AI processing
3. Self-diagnosis assessment
4. Radar chart — current + evolution timeline
5. Group dashboard (group mode)
6. Expert assignment view (group mode)
7. Learning contract form + group contract overview (group mode)
8. Anonymous question feed
9. Personal home dashboard

---

TECHNICAL REQUIREMENTS:
- React frontend (Vite)
- Supabase for auth, database, realtime, and file storage
- OpenAI API (or similar) for document parsing and topic extraction
- Real-time updates via Supabase realtime channels
- Anonymous question system: user_id NEVER stored with questions — 
  use a one-way hash or temporary session token only
- File upload: store in Supabase Storage, process server-side
- Radar chart: use Recharts or Chart.js with smooth animations
- All AI-generated content tagged in database with source field 
  (modulbeschreibung / folien / altklausur / manual)

---

TONE & MICRO-COPY EXAMPLES:
- "Super! Du kennst dich mit Thema A aus."
- "Deine Gruppe wartet auf dich."
- "Noch 3 Tage bis zu deinem Lernvertrag."
- "Wir haben 8 Themen aus deinen Unterlagen erkannt."
- "Thema X kam in 3 von 4 Altklausuren vor — das wird wohl drankommen."
- "Du hast dich bei Thema B seit letzter Woche verbessert."

---

DO NOT BUILD:
- No grades or performance comparison between users
- No public profiles or social feed
- No like buttons or follower mechanics  
- No gamification points or leaderboards
- No mandatory features — everything optional except mode selection
- Keep it focused: study tool, not social network
```

---

## ERGÄNZUNG: Prüfungsfortschritt & Zeitlicher Status

### Exam Progress Bar — immer sichtbar

Auf dem Home Screen und im Group Dashboard wird eine durchgehende 
Fortschrittsanzeige angezeigt die zwei Dimensionen kombiniert:

**Dimension 1 — Zeitlicher Fortschritt (Wie viel Zeit ist noch?)**
- Horizontal Progress Bar: zeigt wie viel der verfügbaren Lernzeit 
  bereits vergangen ist
- Farbe wechselt dynamisch:
  - Grün: mehr als 50% der Zeit verbleibend
  - Gelb: 25–50% verbleibend
  - Rot: unter 25% verbleibend
- Darunter: "Noch X Tage bis zur Prüfung"
- Und: "Du hast Y% deiner Lernzeit genutzt"

**Dimension 2 — Inhaltlicher Fortschritt (Wie viel habe ich gelernt?)**
- Zweite Bar oder Ring direkt daneben / darunter
- Berechnet aus: Anzahl Themen grün (gut) / Gesamtthemen
- Label: "X von Y Themen sicher gelernt"
- Wird bei jeder neuen Selbstdiagnose aktualisiert

**Kombiniertes Signal — "Bin ich im Zeitplan?"**
- Das System vergleicht beide Dimensionen und zeigt ein 
  klares Status-Signal:

  🟢 "Du bist im Zeitplan."
     (Lernfortschritt >= Zeitfortschritt)

  🟡 "Du könntest etwas mehr Gas geben."
     (Lernfortschritt leicht hinter Zeitfortschritt)

  🔴 "Achtung — du hast noch viel vor dir."
     (Lernfortschritt deutlich hinter Zeitfortschritt)

- WICHTIG: Kein Vergleich mit anderen Nutzern — 
  nur Mia vs. Mias eigener Plan

**Micro-Copy Beispiele:**
- "Noch 12 Tage — und du kennst schon 6 von 10 Themen. Gut so."
- "Noch 5 Tage — 4 Themen sind noch offen. Jetzt fokussieren."
- "Prüfung in 3 Tagen — du hast dein Bestes gegeben."

**Platzierung:**
- Home Screen: prominent oben, unter dem Greeting
- Group Dashboard: als geteilte Gruppenansicht 
  (wie viele Themen hat die Gruppe insgesamt abgedeckt?)
- Diagnose-Screen: als Kontext über dem Radar-Chart

