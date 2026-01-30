# CLAUDE.md - Shizuha Home

This file provides guidance to Claude Code when working with the shizuha-home service.

## Service Overview

**Shizuha Home** is the landing page and dashboard service for the Shizuha platform. It serves at the root path `/` and provides:

- **Unauthenticated users**: Marketing landing page with product showcase
- **Authenticated users**: Personalized dashboard with app grid

## Architecture

This is a **frontend-only service** - no backend/API required.

### Key Files

```
shizuha-home/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Router with conditional rendering
│   │   ├── contexts/AuthContext.jsx  # Read-only auth state
│   │   ├── hooks/useTheme.jsx   # Dark mode support
│   │   ├── components/          # UI components
│   │   └── pages/               # LandingPage, HomePage
│   ├── vite.config.js           # Port 5180
│   └── package.json
```

### Auth Pattern

This service uses **read-only auth** - it only checks localStorage for existing tokens:
- `shizuha_access_token` - JWT access token
- `shizuha_user` - Cached user data

Login/logout is handled by shizuha-id at `/id/login` and `/id/logout`.

## Development

### Run locally
```bash
cd shizuha-home/frontend
npm install
npm run dev
```
Runs on http://localhost:5180

### Build Docker image
```bash
docker build -t shizuha-home-frontend ./shizuha-home/frontend
```

### Import to K3s
```bash
docker save shizuha-home-frontend:latest | sudo k3s ctr images import -
```

## Tech Stack

- React 18 + Vite 5
- Tailwind CSS (shared brand theme)
- React Router DOM
- Lucide React icons

## Routes

| Path | Auth Required | Component |
|------|---------------|-----------|
| `/` | No | LandingPage or HomePage (conditional) |

## Styling

Uses the same Tailwind configuration as other Shizuha services:
- Brand colors (indigo palette)
- Dark mode via `class` strategy
- Component classes: `.btn`, `.btn-primary`, `.card`, etc.

## Code Change Requirements

For every major code change, you MUST:

### 1. E2E Testing (Required)
- Write or update Playwright tests for home page functionality
- **NEVER run Playwright on the host machine** - always run inside containers
- Test landing page, authenticated dashboard, app grid
- Tests must pass before work is complete
- Run from root: `docker compose -f docker-compose.test.yml up --abort-on-container-exit`

### 2. Documentation Updates (Required)
- Update this file if routes or components change

### Checklist
- [ ] E2E tests written/updated and passing
- [ ] Documentation updated
- [ ] All commands run inside containers
