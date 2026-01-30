# ROADMAP.md - Shizuha Home

## Completed

### v1.0.0 - Initial Release
- [x] Landing page with hero section
- [x] Product showcase grid (6 products)
- [x] Feature highlights section
- [x] Footer with navigation
- [x] Dark mode support
- [x] Responsive design (mobile, tablet, desktop)
- [x] Authenticated user dashboard
- [x] Welcome banner with time-based greeting
- [x] App grid for quick navigation
- [x] Cross-tab auth sync
- [x] Kubernetes deployment (frontend-only)
- [x] Nginx routing at root path

## In Progress

*Nothing currently in progress*

## Planned

### v1.1.0 - Enhanced Dashboard
- [ ] Recent activity feed from all services
- [ ] Requires new API endpoint for activity aggregation
- [ ] Show last 5-10 activities across apps

### v1.2.0 - Personalization
- [ ] Pinned/favorite apps
- [ ] Drag-and-drop app grid reordering
- [ ] User preferences stored in shizuha-id

### v1.3.0 - Platform Features
- [ ] Platform announcements banner
- [ ] Maintenance mode notice
- [ ] System status indicators

### Future Ideas
- [ ] Global search across all apps
- [ ] Quick actions (create task, new note)
- [ ] Keyboard shortcuts
- [ ] Widget system for dashboard customization
- [ ] Usage analytics dashboard

## Technical Debt

- [ ] Add unit tests with Vitest
- [ ] Add E2E tests with Playwright
- [ ] Add accessibility improvements (ARIA, keyboard nav)
- [ ] Performance optimization (lazy loading, code splitting)

## Dependencies

- shizuha-id: For authentication flow
- All other services: For app navigation and future activity feed
