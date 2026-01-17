# EyeStream Setup Guide

## Prerequisites
- Node.js 18+ and npm
- SQLite support

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Prisma Database
Due to network restrictions in some environments, you may need to manually generate the Prisma client and push the database schema:

```bash
# Generate Prisma Client
npx prisma generate

# Push database schema to SQLite
npx prisma db push

# View database in Prisma Studio (optional)
npx prisma studio
```

If you encounter network issues with Prisma binaries, try:
```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma db push
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Features Implemented

- ✅ RSVP reading with ORP (Optimal Recognition Point) highlighting
- ✅ Reader code system for cross-device sync
- ✅ SQLite database with Prisma ORM
- ✅ Reading library management (add, view, delete)
- ✅ Adjustable WPM (100-600)
- ✅ Progress tracking and auto-save
- ✅ Keyboard shortcuts
- ✅ Offline support with sync queue
- ✅ Responsive design (mobile & desktop)
- ✅ Dark/light theme support
- ✅ Settings management

## Keyboard Shortcuts

- `Space` - Play/Pause
- `←` - Previous sentence
- `→` - Next sentence
- `↑` - Increase WPM by 50
- `↓` - Decrease WPM by 50
- `R` - Restart from beginning
- `Ctrl/Cmd + B` - Toggle sidebar
- `Ctrl/Cmd + N` - Add new text
- `Esc` - Close modals

## Project Structure

```
/prisma
  schema.prisma         # Database schema
  dev.db               # SQLite database (generated)
/src
  /app                 # Next.js app directory
    /api               # API routes
    layout.tsx         # Root layout
    page.tsx           # Main page
  /components          # React components
    /Sidebar           # Sidebar with reading list
    /Reader            # Word display and controls
    /Settings          # Settings modal
    /Onboarding        # Code entry
    /ui                # Reusable UI components
  /hooks               # Custom React hooks
  /lib                 # Utilities (Prisma, code generator)
  /store               # Zustand state management
  /types               # TypeScript types
  /utils               # Helper functions
```

## API Routes

- `POST /api/reader` - Generate new reader code
- `GET /api/reader/[code]` - Validate and get reader
- `GET /api/reader/[code]/settings` - Get settings
- `PUT /api/reader/[code]/settings` - Update settings
- `GET /api/readings?code=XXX` - Get all readings
- `POST /api/readings` - Create new reading
- `GET /api/readings/[id]` - Get single reading
- `PUT /api/readings/[id]` - Update reading
- `DELETE /api/readings/[id]` - Delete reading
- `PATCH /api/readings/[id]/position` - Quick position sync

## Troubleshooting

### Prisma Client Not Generated
If you see errors about `@prisma/client`, run:
```bash
npx prisma generate
```

### Database Not Created
Run:
```bash
npx prisma db push
```

### Module Resolution Errors
Make sure `tsconfig.json` has:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

## Next Steps (Optional Enhancements)

- [ ] PWA service worker implementation
- [ ] EPUB file support
- [ ] Reading statistics
- [ ] Export/import library
- [ ] URL article extraction
- [ ] Multiple color themes
