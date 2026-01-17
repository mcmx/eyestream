# RSVP Speed Reading PWA

## Overview
Build a Progressive Web App (PWA) for RSVP (Rapid Serial Visual Presentation) speed reading using Next.js with a SQLite backend. The app displays one word at a time at a configurable WPM (words per minute) with ORP (Optimal Recognition Point) highlighting. Data is stored server-side to allow seamless switching between phone and desktop.

## Core Feature: ORP Algorithm
Each word has one letter highlighted in RED at the "Optimal Recognition Point" - where the eye naturally focuses. Position logic (0-indexed):

| Word Length | ORP Position |
|-------------|--------------|
| 1 char      | 0            |
| 2-5 chars   | 1            |
| 6-9 chars   | 2            |
| 10-13 chars | 3            |
| 14+ chars   | 4            |

The highlighted letter should be positioned at a FIXED horizontal center point on screen - meaning words shift left/right so the red letter is always in the exact same spot. This eliminates eye movement.

## Cross-Device Sync

### Simple Reader Code System
- On first visit, user can generate a unique "Reader Code" (6-8 alphanumeric characters)
- Code is stored in localStorage for convenience
- User can enter their code on another device to access their library
- No passwords, no email - just the code (simple but effective)
- Option to generate a new code (creates new empty library)
- Display current code in settings so user can note it down

### Sync Behavior
- All reading items stored in SQLite database, associated with reader code
- Position updates sync to server with debouncing (every 5 words or on pause)
- On page load, fetch latest state from server
- Offline support: queue updates in localStorage, sync when back online

## UI Layout

### Left Sidebar Menu (collapsible on mobile)
- List of saved reading texts with titles
- Each item shows:
  - Title (user-editable, or auto-generated from first few words)
  - Progress percentage
  - Last read timestamp
  - WPM used
- "Add New Text" button at top
- Click to load and resume reading from saved position
- Swipe to delete on mobile, delete icon on hover for desktop
- Sidebar collapses to hamburger menu on mobile

### Main Reading Screen (right side)
- Large, centered word display area with dark background (#0a0a0a or similar)
- Word displayed in white, ORP letter in red (#ff4444 or similar)
- Thin vertical line above and below the ORP position (like crosshairs) to guide focus
- Current WPM display
- Progress indicator (percentage AND progress bar)
- Title of current text at top

### Controls (below word display)
- Play/Pause (spacebar keyboard shortcut)
- WPM adjustment: 100, 150, 200, 250, 300, 350, 400, 450, 500, 600 (buttons or slider)
- Restart button
- Skip backward/forward by sentence (arrow keys)

### Add/Edit Text Modal
- Title input field
- Large textarea to paste text
- "Load Sample Text" button with a demo paragraph
- File upload for .txt files
- "Save & Start Reading" button
- "Save for Later" button

### Settings (accessible from header)
- **Reader Code display** (with copy button)
- **"Use Different Code" button** (to switch libraries/devices)
- Font size adjustment
- Dark/Light mode toggle (default dark)
- Default WPM for new texts
- Auto-save frequency (save position every N words)

## Database Schema

### Using Prisma with SQLite

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") // file:./dev.db
}

model Reader {
  id        String   @id @default(cuid())
  code      String   @unique // The 6-8 char reader code
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  readings  Reading[]
  settings  ReaderSettings?
}

model Reading {
  id              String   @id @default(cuid())
  readerId        String
  reader          Reader   @relation(fields: [readerId], references: [id], onDelete: Cascade)

  title           String
  content         String   // Full text content
  wordCount       Int
  currentPosition Int      @default(0) // Current word index
  currentWpm      Int      @default(300)
  isCompleted     Boolean  @default(false)

  createdAt       DateTime @default(now())
  lastReadAt      DateTime @default(now())

  @@index([readerId])
}

model ReaderSettings {
  id            String  @id @default(cuid())
  readerId      String  @unique
  reader        Reader  @relation(fields: [readerId], references: [id], onDelete: Cascade)

  defaultWpm    Int     @default(300)
  fontSize      String  @default("large") // small, medium, large, xlarge
  theme         String  @default("dark")  // dark, light
  autoSaveEvery Int     @default(5)       // Save every N words
}
```

## API Routes

### Reader Management
- `POST /api/reader` - Generate new reader code, create Reader record
- `GET /api/reader/[code]` - Validate code and get reader ID
- `GET /api/reader/[code]/settings` - Get reader settings
- `PUT /api/reader/[code]/settings` - Update reader settings

### Readings CRUD
- `GET /api/readings?code=XXXXXX` - Get all readings for a reader code
- `POST /api/readings` - Create new reading `{ code, title, content }`
- `GET /api/readings/[id]` - Get single reading
- `PUT /api/readings/[id]` - Update reading (title, position, wpm, etc.)
- `DELETE /api/readings/[id]` - Delete reading

### Position Sync (optimized endpoint)
- `PATCH /api/readings/[id]/position` - Quick position update `{ position, wpm }`
  - Lightweight endpoint just for position sync
  - Updates `currentPosition`, `currentWpm`, and `lastReadAt`

## Technical Requirements

### Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS for styling
- Prisma ORM with SQLite
- Zustand for client state management
- next-pwa for PWA functionality
- nanoid for generating reader codes

### PWA Requirements
- Service worker for offline capability
- Web app manifest with icons (multiple sizes)
- Installable on mobile and desktop
- Offline queue for position updates (sync when back online)

### Responsive Design
- Mobile-first approach
- Sidebar becomes bottom sheet or hamburger menu on mobile
- Touch-friendly controls on mobile
- Keyboard shortcuts on desktop
- Works beautifully on phone screens (primary use case)

## File Structure
```
/prisma
  schema.prisma
  dev.db                    # SQLite database file
/src
  /app
    /api
      /reader
        route.ts            # POST: create reader
        /[code]
          route.ts          # GET: validate code
          /settings
            route.ts        # GET, PUT: reader settings
      /readings
        route.ts            # GET, POST: list/create readings
        /[id]
          route.ts          # GET, PUT, DELETE: single reading
          /position
            route.ts        # PATCH: quick position sync
    layout.tsx
    page.tsx
    globals.css
  /components
    Sidebar/
      Sidebar.tsx
      ReadingItem.tsx
      AddTextModal.tsx
    Reader/
      WordDisplay.tsx
      Controls.tsx
      ProgressBar.tsx
    Settings/
      SettingsModal.tsx
      ReaderCodeDisplay.tsx
    Onboarding/
      CodeEntry.tsx         # Enter existing code or generate new
    ui/
      Button.tsx
      Modal.tsx
      Slider.tsx
  /hooks
    useRSVP.ts
    useKeyboardShortcuts.ts
    useSync.ts              # Handle server sync with debouncing
    useOfflineQueue.ts      # Queue updates when offline
  /store
    useReaderStore.ts       # Zustand store
  /lib
    prisma.ts               # Prisma client singleton
    generateCode.ts         # Generate reader codes
  /utils
    orp.ts
    textParser.ts
  /types
    index.ts
/public
  manifest.json
  icons/
```

## Text Parsing Rules
- Split on whitespace
- Keep punctuation attached to words
- Pause slightly longer (1.5x delay) on sentence-ending punctuation (. ! ?)
- Pause slightly longer (1.2x delay) on clause punctuation (, ; :)
- Handle em-dashes and ellipses gracefully

## Keyboard Shortcuts
- Space: Play/Pause
- Left Arrow: Back one sentence
- Right Arrow: Forward one sentence
- Up Arrow: Increase WPM by 50
- Down Arrow: Decrease WPM by 50
- R: Restart from beginning
- Escape: Close modals / Return to paused state
- Ctrl/Cmd + N: Add new text
- Ctrl/Cmd + B: Toggle sidebar

## Sync & Offline Behavior

### Position Sync Strategy
```typescript
// Debounced sync - don't hammer the server
const syncPosition = useDebouncedCallback(
  async (readingId: string, position: number, wpm: number) => {
    await fetch(`/api/readings/${readingId}/position`, {
      method: 'PATCH',
      body: JSON.stringify({ position, wpm })
    });
  },
  1000 // Wait 1 second after last change
);

// Also sync on:
// - Pause
// - Every 5 words (configurable)
// - Page visibility change (user switches tab)
// - Before unload
```

### Offline Queue
- If fetch fails, store update in localStorage queue
- On next successful connection, replay queued updates
- Show subtle "offline" indicator in UI
- Show "syncing..." when replaying queue

## Sample Text for Testing
Include a "Load Sample" button that loads 2-3 paragraphs of interesting content. Suggest using an excerpt from a public domain book or an interesting science article.

## User Flow

### First Visit
1. Show welcome screen with two options:
   - "Generate New Code" → Creates reader, shows code, prompts to save it
   - "I Have a Code" → Enter existing code to load library
2. After code setup, show empty library with prompt to add first text

### Returning Visit (same device)
1. Code stored in localStorage
2. Auto-load library on page load
3. Go straight to reading interface

### New Device
1. Detect no code in localStorage
2. Show code entry screen
3. Enter existing code → Load full library with all progress intact

## Nice to Have (implement if time permits)
- Estimated time remaining display
- Reading session stats (words read, time spent)
- Export/Import library as JSON backup
- EPUB file parsing support
- URL input to fetch and extract article text (readability-style)
- Reading streaks/gamification
- Multiple color themes beyond dark/light
- Adjustable ORP highlight color
- "Share" a reading via unique URL (read-only)
