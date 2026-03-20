# Claude Code Prompt — Mias Lernkreis
**Vollständiger Build-Prompt für Claude Code CLI**
**DTconsulting | Design Thinking Sprint | 2026**

---

## Kontext & Auftrag

Baue eine vollständige Web-Applikation namens **"Mias Lernkreis"** — ein soziales Lernbegleitsystem für Studierende zur strukturierten Prüfungsvorbereitung. Die App entstand aus einem Design Thinking Sprint bei DTconsulting und ist auf die Persona Mia zugeschnitten: eine 22-jährige BWL-Studentin die sozial lernt, kollektiv rät statt dem eigenen Urteil zu vertrauen, und Unterstützung ohne Scham braucht.

---

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage, Realtime)
- **KI-Verarbeitung:** OpenAI API (GPT-4o) für Dokumentenanalyse
- **Charts:** Recharts für Radar-Chart und Progress-Visualisierungen
- **Icons:** Lucide React
- **Routing:** React Router v6
- **State:** Zustand
- **File parsing:** pdf-parse für PDF-Extraktion

---

## Design System

```
Farben:
  Primary:     #4A2C6E  (deep purple)
  Accent:      #7B4FA6  (lavender)
  Light:       #EDE6F5  (soft purple bg)
  Background:  #F6F4FA  (warm off-white)
  Surface:     #FFFFFF
  Border:      #D5C8E8
  Text:        #1C1828
  Muted:       #7A6E8A
  Success:     #1A5C3A
  Warning:     #7A4A00
  Danger:      #8B1A1A

Typografie:
  Font: Inter (Google Fonts)
  Heading: 700/800 weight
  Body: 400/500 weight

Radius: rounded-xl für Cards, rounded-full für Badges
Schatten: shadow-sm bis shadow-md, weich
Sprache: Deutsch, "du" nicht "Sie"
Ton: freundlich, ermutigend, nie wertend
```

---

## Datenbankschema (Supabase)

```sql
-- Nutzer (via Supabase Auth)
profiles (
  id uuid references auth.users,
  name text,
  created_at timestamp
)

-- Kurse
courses (
  id uuid primary key,
  name text not null,
  exam_date date not null,
  university text,
  owner_id uuid references profiles,
  mode text check (mode in ('solo', 'group')),
  join_code text unique,  -- nur group mode, 6 Zeichen
  created_at timestamp
)

-- Kurs-Mitglieder
course_members (
  id uuid primary key,
  course_id uuid references courses,
  user_id uuid references profiles,
  role text default 'member',
  joined_at timestamp
)

-- Themen
topics (
  id uuid primary key,
  course_id uuid references courses,
  name text not null,
  source text check (source in ('manual', 'modulbeschreibung', 'folien', 'altklausur', 'combined')),
  exam_frequency integer default 0,  -- wie oft in Altklausuren
  is_ai_suggested boolean default false,
  sort_order integer,
  created_at timestamp
)

-- Selbstdiagnose-Snapshots
diagnoses (
  id uuid primary key,
  user_id uuid references profiles,
  course_id uuid references courses,
  completed_at timestamp,
  notes text
)

-- Themen-Bewertungen pro Diagnose
diagnosis_ratings (
  id uuid primary key,
  diagnosis_id uuid references diagnoses,
  topic_id uuid references topics,
  rating text check (rating in ('green', 'yellow', 'red'))
)

-- Lernverträge
learning_contracts (
  id uuid primary key,
  course_id uuid references courses,
  user_id uuid references profiles,
  topic_id uuid references topics,
  description text,
  format text check (format in ('live', 'summary', 'video')),
  deadline date,
  status text check (status in ('pending', 'in_progress', 'done')) default 'pending',
  is_ai_suggested boolean default false,
  created_at timestamp
)

-- Anonyme Fragen (KEIN user_id Feld -- echte Anonymität)
questions (
  id uuid primary key,
  course_id uuid references courses,
  topic_id uuid references topics,
  content text not null,
  upvotes integer default 0,
  created_at timestamp
  -- WICHTIG: Kein user_id, kein session_id -- vollständig anonym
)

-- Fragen-Upvotes (session-basiert, nicht user-basiert)
question_upvotes (
  id uuid primary key,
  question_id uuid references questions,
  session_token text,  -- einmaliger Hash, nicht rückverfolgbar
  created_at timestamp
)

-- Hochgeladene Materialien
course_materials (
  id uuid primary key,
  course_id uuid references courses,
  type text check (type in ('modulbeschreibung', 'folien', 'altklausur')),
  filename text,
  storage_path text,
  processed boolean default false,
  extracted_topics jsonb,
  created_at timestamp
)
```

---

## Supabase Row Level Security

```sql
-- Profiles: nur eigenes Profil lesen/schreiben
-- Courses: Mitglieder können lesen, Owner kann schreiben
-- Topics: Mitglieder können lesen, Owner kann schreiben
-- Diagnoses: nur eigene lesen/schreiben
-- Diagnosis_ratings: nur eigene lesen/schreiben
-- Learning_contracts: Mitglieder können lesen, Owner kann schreiben
-- Questions: alle Mitglieder können lesen und schreiben (anonym)
-- Course_materials: Mitglieder können lesen, Owner kann hochladen
```

---

## App-Struktur & Routing

```
/                          Landing Page
/auth                      Login / Signup
/onboarding                Mode-Auswahl + Kurs anlegen
/onboarding/upload         Material-Upload
/onboarding/processing     KI-Verarbeitung (Loading Screen)
/join/:code                Gruppe beitreten
/app/home                  Home Dashboard
/app/diagnose              Selbstdiagnose starten
/app/diagnose/result       Radar-Chart + Empfehlung
/app/diagnose/history      Verlauf aller Diagnosen
/app/gruppe                Gruppen-Dashboard (group mode)
/app/gruppe/vertrag        Lernvertrag anlegen/bearbeiten
/app/fragen                Anonyme Fragen
/app/fortschritt           Fortschrittsanzeige + Timeline
/app/profil                Profil + Kurs-Einstellungen
```

---

## Screens & Komponenten — detailliert

### 1. Landing Page `/`

```
- Hero: "Lerne smarter — gemeinsam und strukturiert"
- Subtext: Kurze Erklärung was Mias Lernkreis ist
- CTA: "Jetzt starten" → /auth
- Sekundär: "Gruppe beitreten" → /join
- Visuell: einfache Illustration der 5 Phasen als Icons
```

### 2. Auth `/auth`

```
- Email + Password Login
- Signup mit Name, Email, Password
- Supabase Auth
- Nach Login → /onboarding wenn noch kein Kurs, sonst /app/home
```

### 3. Onboarding `/onboarding`

**Step 1 — Mode-Auswahl:**
```
Zwei große Karten zur Auswahl:

  🧑 "Ich lerne allein" (Solo Mode)
     "Strukturiere deine Vorbereitung für dich selbst"

  👥 "Ich lerne mit einer Gruppe" (Gruppen Mode)
     "Lerne gemeinsam und teile Verantwortung"
```

**Step 2 — Kurs-Details:**
```
- Kursname (Freitext, required)
- Prüfungsdatum (Datepicker, required)
- Hochschule (optional)
- Bei Group Mode: Gruppe erstellen (→ generiert 6-Zeichen Code)
  oder bestehender Gruppe beitreten (→ /join/:code)
```

### 4. Material-Upload `/onboarding/upload`

```
Drei Upload-Bereiche (Drag & Drop + Click):

  📄 Modulbeschreibung
     "PDF hochladen oder Text direkt einfügen"
     Text-Textarea als Alternative zum Upload

  📊 Vorlesungsfolien / Skript
     "PDF oder PPTX — max 50MB"
     Mehrere Dateien erlaubt

  📝 Altklausuren
     "PDF — max 50MB pro Datei"
     Mehrere Dateien erlaubt

Jeder Bereich: Upload-Status, Dateiname, Entfernen-Button
"Jetzt überspringen" Link immer sichtbar
"Weiter →" Button aktiviert sich nach mind. 1 Upload oder Skip
```

### 5. KI-Verarbeitung `/onboarding/processing`

```
Animierter Loading Screen:
- Spinner + freundliche Nachrichten die rotieren:
  "Wir lesen deine Unterlagen..."
  "Themen werden erkannt..."
  "Lernplan wird vorbereitet..."

Nach Abschluss: Zusammenfassung was extrahiert wurde:
  "✓ 8 Themen aus Modulbeschreibung erkannt"
  "✓ 3 Themen aus Altklausuren priorisiert"
  "✓ Lernvertrag-Vorschläge erstellt"

→ /app/home
```

**KI-Verarbeitungslogik (OpenAI API):**

```typescript
// Für Modulbeschreibung:
prompt: `Extrahiere alle Lernthemen aus dieser Modulbeschreibung.
Gib zurück: JSON Array mit { name: string, description: string }
Modulbeschreibung: ${text}`

// Für Folien/Skript:
prompt: `Analysiere dieses Lehrskript.
Extrahiere: 1) Hauptthemen, 2) Prüfungsrelevante Abschnitte,
3) Vorgeschlagene Lerninhalte pro Thema.
Gib zurück: JSON Array mit {
  name: string,
  content_summary: string,
  exam_relevance: 'high' | 'medium' | 'low'
}`

// Für Altklausuren:
prompt: `Analysiere diese Altklausur.
Extrahiere welche Themen geprüft werden und wie oft.
Gib zurück: JSON Array mit { topic: string, frequency: number }`

// Alle KI-Vorschläge mit is_ai_suggested: true in DB speichern
```

### 6. Home Dashboard `/app/home`

```
Layout (mobile-first, max 4 Elemente):

  ┌─────────────────────────────────┐
  │ Guten Morgen, Mia 👋            │
  │ Noch 12 Tage bis zur Prüfung   │
  ├─────────────────────────────────┤
  │ FORTSCHRITT                     │
  │ Zeit:    ████████░░ 78%         │
  │ Themen:  █████░░░░░ 5/10 grün   │
  │ Status:  🟡 Etwas mehr Gas geben│
  ├─────────────────────────────────┤
  │ DIAGNOSE                        │
  │ Letztes Update: vor 3 Tagen    │
  │ [Neue Diagnose starten →]       │
  ├─────────────────────────────────┤
  │ LERNVERTRAG (group mode)        │
  │ Thema A — in 2 Tagen fällig    │
  │ [Zum Vertrag →]                 │
  └─────────────────────────────────┘
```

**Progress Bar Logik:**
```typescript
const daysTotal = differenceInDays(examDate, courseCreatedAt)
const daysRemaining = differenceInDays(examDate, today)
const timeProgress = ((daysTotal - daysRemaining) / daysTotal) * 100

const topicsGreen = ratings.filter(r => r.rating === 'green').length
const topicsTotal = topics.length
const contentProgress = (topicsGreen / topicsTotal) * 100

// Kombiniertes Signal
const status =
  contentProgress >= timeProgress ? 'on_track' :
  contentProgress >= timeProgress - 20 ? 'slight_delay' : 'behind'

// Farbe der Zeitbar
const timeBarColor =
  daysRemaining > daysTotal * 0.5 ? 'green' :
  daysRemaining > daysTotal * 0.25 ? 'yellow' : 'red'
```

### 7. Selbstdiagnose `/app/diagnose`

```
- Liste aller Themen des Kurses
- Für jedes Thema: 3-Button Toggle
  [✓ Ich kenne das gut] [~ Bin unsicher] [✗ Muss ich lernen]
  Farben: grün / gelb / rot

- Bei Altklausur-Themen: Badge "🔥 Häufig geprüft"
- Bei KI-Vorschlägen: Badge "KI-Vorschlag" (editierbar)
- Thema hinzufügen Button am Ende der Liste

- Progress Indicator oben: "X von Y Themen bewertet"
- "Diagnose abschließen" Button (aktiv wenn alle bewertet)

- Min. 24h Wartezeit zwischen Diagnosen
  → wenn zu früh: "Du hast heute schon eine Diagnose gemacht.
    Komm morgen wieder für einen neuen Check."
```

### 8. Radar Chart & Verlauf `/app/diagnose/result`

```
Recharts RadarChart Komponente:

  Aktueller Zustand:
  - Vollständiger farbiger Radar (grün=gut, Durchschnitt als Fläche)
  - Jedes Thema als Achse
  - Tooltip mit Themenname + Bewertung

  Toggle "Verlauf anzeigen":
  - Alle gespeicherten Snapshots als überlagernde Flächen
  - Älteste: 10% Opacity, neueste: 100% Opacity
  - Farbe: Primärfarbe mit steigender Intensität

  Timeline darunter:
  - Punkte für jedes Diagnose-Datum
  - Klickbar → zeigt diesen Snapshot hervorgehoben
  - Animated transition zwischen Snapshots (300ms ease)

  Empfehlung-Card nach Diagnose:
  ┌─────────────────────────────────┐
  │ ✨ Du kennst Thema A am besten  │
  │    Werde Expertin dafür!        │
  │    [Lernvertrag anlegen →]      │
  └─────────────────────────────────┘

  Motivations-Copy bei Verbesserung:
  "Du hast dich bei Thema B seit letzter Woche verbessert 🎉"
```

### 9. Gruppen-Dashboard `/app/gruppe` (group mode)

```
Header: Gruppenname + Join-Code (teilbar)
Exam Countdown + Gruppen-Fortschritt

Mitglieder-Grid:
  ┌──────────┐ ┌──────────┐ ┌──────────┐
  │ 👤 Mia   │ │ 👤 Jonas │ │ 👤 Sarah │
  │ Thema A  │ │ Thema B  │ │ Thema C  │
  │ ✓ fertig │ │ ⏳ offen │ │ ✓ fertig │
  └──────────┘ └──────────┘ └──────────┘

Puzzle-Motiv: SVG Puzzle mit 1 Piece pro Mitglied
Unbesetzte Themen in Orange mit CTA

Lernverträge-Liste:
  - Alle aktiven Verträge mit Status-Badges
  - Deadline-Countdown bei nahenden Abgaben
  - Konfetti-Animation bei Completion

Gruppen-Realtime via Supabase:
  - Live-Updates wenn Mitglieder Diagnose abschließen
  - Toast: "Jonas hat seine Diagnose abgeschlossen 🎯"
```

### 10. Lernvertrag `/app/gruppe/vertrag`

```
Formular (vorausgefüllt wo möglich):
  - Thema (Dropdown, vorausgewählt aus Expertenempfehlung)
  - Was ich erkläre (Freitext, aus Folien vorausgefüllt wenn verfügbar)
  - Format: [Live Session] [Schriftliche Zusammenfassung] [Video]
  - Deadline: Datepicker (vorgeschlagen: 5 Tage vor Prüfung)
  - KI-Vorschlag Badge wenn aus Materialien generiert

Status-Updates:
  pending → in_progress → done
  Bei 'done': Konfetti + Gruppen-Notification
```

### 11. Anonyme Fragen `/app/fragen`

```
WICHTIG: Kein user_id wird jemals mit Fragen verknüpft.

Frage-Input:
  - Textarea "Was ist noch unklar?"
  - Thema-Dropdown (optional)
  - "Anonym stellen" Button
  - Kein Name, kein Avatar, keine Zuordnung möglich

Fragen-Feed:
  - Sortiert nach Upvotes (Standard) oder Neueste
  - Gefiltert nach Thema (optional)
  - Jede Frage: Content + Thema-Badge + Upvote-Button (+1)
  - Upvote via session_token (localStorage Hash, einmalig)

Export-Button:
  - "Top-Fragen exportieren"
  - Generiert PDF: saubere Liste der Top-10 Fragen nach Thema
  - Für Weiterleitung an Dozenten/Tutor

Solo Mode: Fragen in kursweitem anonymem Pool
Group Mode: Fragen in Gruppen-Pool
```

### 12. Fortschritt `/app/fortschritt`

```
Zwei Progress Bars nebeneinander:

  ZEIT          THEMEN
  ████░░ 67%    ███░░░ 5/10

Kombiniertes Signal (prominent):
  🟢 "Du bist im Zeitplan."
  🟡 "Du könntest etwas mehr Gas geben."
  🔴 "Achtung — du hast noch viel vor dir."

Diagnose-Timeline:
  - Alle Snapshots als Zeitstrahl
  - Klick → öffnet Radar-Chart dieses Zeitpunkts
  - Delta-Anzeige zwischen erstem und letztem Snapshot

Themen-Übersicht:
  - Alle Themen mit aktuellem Status
  - Sortiert nach: rot zuerst (priorisiert)
  - Schnell-Update möglich ohne neue Volldiagnose
```

---

## KI-Verarbeitung — Implementierung

```typescript
// server/processDocument.ts

import OpenAI from 'openai'
import pdfParse from 'pdf-parse'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function extractTopicsFromModulbeschreibung(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Du bist ein Assistent für Studierende.
Extrahiere alle Lernthemen aus dieser Modulbeschreibung.
Antworte NUR mit einem JSON Array, kein weiterer Text.
Format: [{"name": "Themenname", "description": "Kurzbeschreibung"}]

Modulbeschreibung:
${text}`
    }],
    response_format: { type: 'json_object' }
  })
  return JSON.parse(response.choices[0].message.content || '[]')
}

export async function extractTopicsFromFolien(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Du analysierst Vorlesungsunterlagen für Studierende.
Extrahiere Hauptthemen und prüfungsrelevante Inhalte.
Antworte NUR mit JSON, kein weiterer Text.
Format: [{"name": "Thema", "content_summary": "Zusammenfassung",
"exam_relevance": "high|medium|low", "learning_content": "Was zu lernen ist"}]

Unterlagen:
${text}`
    }],
    response_format: { type: 'json_object' }
  })
  return JSON.parse(response.choices[0].message.content || '[]')
}

export async function extractTopicsFromAltklausur(text: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Du analysierst eine Altklausur für Studierende.
Extrahiere welche Themen geprüft werden.
Antworte NUR mit JSON, kein weiterer Text.
Format: [{"topic": "Themenname", "frequency": 1, "question_types": ["Aufgabentyp"]}]

Klausur:
${text}`
    }],
    response_format: { type: 'json_object' }
  })
  return JSON.parse(response.choices[0].message.content || '[]')
}
```

---

## Anonymitäts-Implementierung

```typescript
// Anonyme Fragen — KEIN user_id
// session_token wird nur für Upvote-Deduplizierung verwendet
// Nie mit Nutzeridentität verknüpfbar

function generateSessionToken(): string {
  // Einmaliger Hash aus Zeitstempel + Random
  // Wird in localStorage gespeichert
  // Kann nicht auf Nutzer zurückgeführt werden
  const raw = `${Date.now()}-${Math.random()}-${Math.random()}`
  return btoa(raw).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32)
}

// Beim Stellen einer Frage:
await supabase.from('questions').insert({
  course_id: courseId,
  topic_id: topicId || null,
  content: questionText,
  // KEIN user_id Feld
})

// Beim Upvoten:
const token = localStorage.getItem('session_token')
  || generateSessionToken()
localStorage.setItem('session_token', token)

await supabase.from('question_upvotes').insert({
  question_id: questionId,
  session_token: token
  // KEIN user_id
})
```

---

## Realtime (Supabase)

```typescript
// Gruppen-Realtime
supabase
  .channel(`course:${courseId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'diagnoses',
    filter: `course_id=eq.${courseId}`
  }, (payload) => {
    showToast(`Ein Mitglied hat seine Diagnose abgeschlossen 🎯`)
    refetchGroupData()
  })
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'learning_contracts',
    filter: `course_id=eq.${courseId}`
  }, (payload) => {
    if (payload.new.status === 'done') {
      showConfetti()
      showToast(`Lernvertrag abgeschlossen 🎓`)
    }
    refetchContracts()
  })
  .subscribe()
```

---

## Micro-Copy — vollständige Liste

```
Onboarding:
  "Wie lernst du am liebsten?"
  "Wir bereiten alles für dich vor..."
  "Wir haben X Themen aus deinen Unterlagen erkannt."
  "Thema X kam in 3 von 4 Altklausuren vor — das wird wohl drankommen."

Home:
  "Guten Morgen, [Name] 👋"
  "Noch X Tage bis zur Prüfung."
  "Du bist im Zeitplan. Weiter so."
  "Du könntest etwas mehr Gas geben."
  "Achtung — du hast noch viel vor dir."
  "Zeit für eine neue Diagnose — wie läuft's?"

Diagnose:
  "Wie sicher fühlst du dich bei diesem Thema?"
  "Super! Du kennst dich mit Thema A aus."
  "Diagnose abgeschlossen. Schau dir dein Profil an."
  "Du hast dich bei Thema B seit letzter Woche verbessert 🎉"
  "Du hast heute schon eine Diagnose gemacht. Komm morgen wieder."

Gruppe:
  "Deine Gruppe wartet auf dich."
  "Jonas hat seine Diagnose abgeschlossen 🎯"
  "Noch 3 Tage bis zu deinem Lernvertrag."
  "Sarah hat Thema C erklärt 🎓"
  "Nicht alle Themen sind noch besetzt — möchtest du eines übernehmen?"

Fragen:
  "Was ist noch unklar? Frag anonym."
  "Deine Frage wurde gestellt. Niemand weiß dass sie von dir kommt."
  "X andere fragen sich das auch."

Leer-Zustände:
  "Noch keine Fragen — sei die Erste!"
  "Noch keine Diagnose — starte jetzt."
  "Noch kein Lernvertrag — leg los."
```

---

## Projektstruktur

```
mias-lernkreis/
├── src/
│   ├── components/
│   │   ├── ui/              (shadcn components)
│   │   ├── radar/           (RadarChart, RadarHistory)
│   │   ├── progress/        (ProgressBar, StatusSignal)
│   │   ├── diagnosis/       (TopicRating, DiagnosisForm)
│   │   ├── group/           (MemberCard, PuzzleMotif, ContractCard)
│   │   ├── questions/       (QuestionFeed, QuestionInput)
│   │   └── upload/          (UploadZone, ProcessingScreen)
│   ├── pages/
│   │   ├── Landing.tsx
│   │   ├── Auth.tsx
│   │   ├── onboarding/
│   │   │   ├── ModeSelection.tsx
│   │   │   ├── CourseSetup.tsx
│   │   │   ├── MaterialUpload.tsx
│   │   │   └── Processing.tsx
│   │   └── app/
│   │       ├── Home.tsx
│   │       ├── Diagnose.tsx
│   │       ├── DiagnoseResult.tsx
│   │       ├── DiagnoseHistory.tsx
│   │       ├── Gruppe.tsx
│   │       ├── Vertrag.tsx
│   │       ├── Fragen.tsx
│   │       ├── Fortschritt.tsx
│   │       └── Profil.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── openai.ts
│   │   ├── anonymity.ts
│   │   ├── progress.ts      (Fortschritts-Berechnungen)
│   │   └── joinCode.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── courseStore.ts
│   │   └── diagnosisStore.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql
│   └── functions/
│       └── process-document/
│           └── index.ts
├── .env.local
├── package.json
└── README.md
```

---

## Umgebungsvariablen

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

---

## Build-Reihenfolge für Claude Code

1. Projekt initialisieren (Vite + React + TypeScript + Tailwind + shadcn)
2. Supabase einrichten + Datenbankschema + RLS Policies
3. Auth (Login / Signup) mit Supabase Auth
4. Onboarding Flow (Mode-Auswahl → Kurs-Setup → Upload → Processing)
5. OpenAI Dokumentenverarbeitung (Supabase Edge Function)
6. Selbstdiagnose + Themen-Bewertung
7. Radar Chart mit Verlauf (Recharts)
8. Home Dashboard + Progress Bars + Statuslogik
9. Gruppen-Dashboard + Realtime + Puzzle-Motiv
10. Lernvertrag (CRUD + Status-Updates + Konfetti)
11. Anonyme Fragen (Insert ohne user_id + Upvotes + Export)
12. Fortschritts-Screen + Timeline
13. Responsive Polish + Micro-Copy + Animationen
14. Testing + Edge Cases (leere Zustände, Fehlerbehandlung)

---

## Wichtige Hinweise

- **Anonymität ist nicht verhandelbar:** Kein user_id bei Fragen — weder in der DB noch in Logs
- **Alle KI-Vorschläge sind editierbar** und mit Badge gekennzeichnet
- **Solo Mode** hat vollen Funktionsumfang außer Gruppenfeatures
- **Mindestintervall** zwischen Diagnosen: 24 Stunden
- **Realtime** nur im Gruppen-Mode aktiv (Performance)
- **Mobile-first** — alle Screens auf 375px Breite designen
- **Kein Vergleich zwischen Nutzern** — nur Mia vs. Mias eigener Plan
