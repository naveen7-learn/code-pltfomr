# Code Review & Collaboration Platform

A modern full-stack code review platform inspired by GitHub and VS Code, built with React, Vite, Tailwind CSS, Framer Motion, Monaco Editor, Node.js, Express, MongoDB, and Socket.io.

## Apps

- `frontend/`: React client with interactive dashboard, repository explorer, Monaco editor, diff viewer, review threads, notifications, search, keyboard shortcuts, theme toggle, and responsive layout.
- `backend/`: Express API with JWT auth, MVC organization, rate limiting, uploads, review workflows, real-time events, and MongoDB persistence.

## Quick Start

1. Install dependencies:

```bash
npm run install:all
```

2. Create env files from the examples:

- `backend/.env`
- `frontend/.env`

3. Start development:

```bash
npm run dev
```

## Features

- JWT authentication with persistent sessions
- Animated dashboard with loading shimmer states
- Project and repository management
- Monaco code editor with autosave and theme switching
- Pull request workflows with diff visualization
- Inline comments, threaded discussions, reactions, and resolution
- Socket.io powered live updates, typing indicators, and notifications
- Activity timeline, version history slider, instant search, drag and drop uploads, and keyboard shortcuts
