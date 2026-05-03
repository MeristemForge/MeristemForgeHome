# MeristemForge

[中文文档](README.zh.md)

MeristemForge website frontend — SDK project showcase and admin management.

## Tech Stack

- Vue 3 (Composition API + `<script setup>`)
- TypeScript, Vite, Vue Router 4, Pinia, Vue I18n 9

## Features

**Public**
- Home page with particle animation hero + project cards
- Project list / project detail (versions, platforms, file downloads)

**Admin (login required)**
- Project CRUD
- Version management (create, edit, delete)
- File upload / delete

**General**
- Dark / light theme toggle
- EN / ZH internationalization
- Responsive layout
- Route transitions, toast notifications, 404 page

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

Mock credentials: `admin` / `admin`

## Build

```bash
cd frontend
npm run build
```

Output in `frontend/dist/`.

## API

The frontend calls the backend REST API via `/api/v1/`. During development, Vite proxies requests to `http://localhost:8080`.

Currently using a mock data layer (`src/api/mock.ts`). When the backend is ready, switch to real implementations in `src/api/projects.ts` and `src/api/auth.ts`.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/projects` | List projects |
| GET | `/api/v1/projects/:id` | Get project |
| POST | `/api/v1/projects` | Create project |
| PUT | `/api/v1/projects/:id` | Update project |
| DELETE | `/api/v1/projects/:id` | Delete project |
| GET | `/api/v1/projects/:id/versions` | List versions |
| POST | `/api/v1/projects/:id/versions` | Create version |
| PUT | `/api/v1/versions/:id` | Update version |
| DELETE | `/api/v1/versions/:id` | Delete version |
| POST | `/api/v1/versions/:id/files` | Upload file |
| DELETE | `/api/v1/files/:id` | Delete file |
| GET | `/api/v1/files/:id/download` | Download file |

## Project Structure

```
frontend/src/
├── api/            # API calls (mock + real client)
├── assets/         # Global styles
├── components/     # Shared components
├── composables/    # Composables
├── i18n/           # Internationalization
├── router/         # Router
├── stores/         # Pinia stores
├── types/          # TypeScript types
└── views/          # Pages
    └── admin/      # Admin pages
```

## License

[MIT](LICENSE)
