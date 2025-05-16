# Todo Plan: App Screenshot Showcase Feature & Tag Integration (Prod Ready)

**Project Rules Reminder:**
- All tasks are initially assigned to `@cline`.
- Mark tasks as `[x] Task description — @cline` upon completion.
- Keep this file updated with the progress.

---

## Phase 1: Backend & Data Model Setup

### 1.1. Database Schema & Migrations
-   `[x] Define `zirospace_apps` table schema — @cline`
-   `[x] Define `zirospace_tags` table schema — @cline`
-   `[x] Define `zirospace_app_tags` linking table schema — @cline`
-   `[x] Define `zirospace_screenshots` table schema — @cline`
-   `[x] Define `zirospace_app_ratings` table schema — @cline`
-   `[x] Define `zirospace_screenshot_ratings` table schema — @cline`
-   `[x] Create Supabase database migrations for all new tables and ensure they are idempotent and production-ready — @cline`
-   `[x] Seed initial data for `zirospace_apps`, `zirospace_screenshots`, `zirospace_tags`, and `zirospace_app_tags` for development and testing — @cline`
-   `[ ] Task: Review all table constraints (FKs, UNIQUE, NOT NULL) for production integrity — @cline`
-   `[ ] Task: Ensure appropriate database indexes are created for performance on frequently queried columns (e.g., `app_id`, `slug`, `order_index`, `name` in tags) — @cline`

### 1.2. API Endpoint Development (Apps)
-   `[x] **FIX & ENHANCE:** Update `GET /api/apps` (in `src/app/api/apps/route.ts`) — @cline`
    -   `[x] Modify Supabase query to correctly fetch associated tags: `zirospace_apps(*, zirospace_app_tags(zirospace_tags(id, name)))`.
    -   `[x] Implement data mapping to transform nested Supabase tag response to a flat `tags: [{id: number, name: string}, ...]` array on the app object.
    -   `[x] Implement filtering by name/description (already done).
    -   `[x] **ENHANCE:** Implement robust server-side filtering by `tag_ids` (if multiple tags are provided, consider if it's AND or OR logic for filtering). (Implemented OR logic) — @cline`
    -   `[x] Implement pagination (already done).
    -   `[x] Implement sorting (already done).
-   `[x] Create API endpoint: `POST /api/apps` (Create app) — @cline`
    -   `[x] **ENHANCE:** Modify to accept `tag_ids: number[]` and create associations in `zirospace_app_tags`. — @cline`
-   `[x] Create API endpoint: `GET /api/apps/{appId}` (Get app details) — @cline`
    -   `[x] **ENHANCE:** Ensure this endpoint also correctly fetches and maps associated tags for the specific app using the join table. — @cline`
-   `[x] Create API endpoint: `PUT /api/apps/{appId}` (Update app) — @cline`
    -   `[x] **ENHANCE:** Modify to accept `tag_ids: number[]` and update associations in `zirospace_app_tags` (clear old, insert new). — @cline`
-   `[x] Create API endpoint: `DELETE /api/apps/{appId}` (Delete app, ensure cascading deletes for `zirospace_app_tags` and `zirospace_screenshots` are working) — @cline`

### 1.3. API Endpoint Development (Screenshots & Upload)
-   `[x] Review existing `src/hooks/use-upload.tsx` and `src/app/api/upload/route.ts` — @cline`
-   `[x] Create API endpoint: `POST /api/apps/{appId}/screenshots` — @cline`
-   `[x] Create API endpoint: `GET /api/apps/{appId}/screenshots` — @cline`
-   `[x] Create API endpoint: `GET /api/screenshots/{screenshotId}` — @cline`
-   `[x] Create API endpoint: `PUT /api/screenshots/{screenshotId}` — @cline`
-   `[x] Create API endpoint: `DELETE /api/screenshots/{screenshotId}` — @cline`
-   `[x] Implement API endpoint: `POST /api/apps/{appId}/screenshots/reorder` — @cline`

### 1.4. API Endpoint Development (Ratings)
-   `[x] Create API endpoint: `POST /api/apps/{appId}/ratings` — @cline`
-   `[x] Create API endpoint: `POST /api/screenshots/{screenshotId}/ratings` — @cline`
-   `[x] Implement backend logic to calculate and update `average_rating` — @cline`

### 1.5. API Endpoint Development (Tags - CRUD for Admin)
-   `[x] Create API endpoint: `GET /api/tags` (Fetch all available tags. Response: `[{id: number, name: string}, ...]`) — @cline`
-   `[x] Create API endpoint: `POST /api/tags` (Admin: Create a new tag. Request: `{name: string}`. Response: created tag object. Handle potential duplicate names.) — @cline`
-   `[x] Create API endpoint: `PUT /api/tags/{tagId}` (Admin: Update a tag name. Request: `{name: string}`. Response: updated tag object. Handle potential duplicate names.) — @cline`
-   `[x] Create API endpoint: `DELETE /api/tags/{tagId}` (Admin: Delete a tag. Ensure associations in `zirospace_app_tags` are also removed. Response: success/failure) — @cline`

### 1.6. Authentication & Authorization
-   `[x] Ensure all admin-specific API endpoints are protected with basic authentication check — @cline`
-   `[ ] Task: Review and refine authorization logic. Consider if role-based access is needed or if simple authentication is sufficient for admin tasks. — @cline`

---

## Phase 2: Admin Panel - App, Screenshot & Tag Management

### 2.1. App Management UI (Admin)
-   `[x] Create admin page for managing apps (`/admin/sections/apps`) — @cline`
-   `[x] UI: Display list of existing apps — @cline`
-   `[x] UI: Enhance "Create App" form (`src/app/(admin)/admin/sections/apps/page.tsx`) — @cline`:
    -   `[x] Fetch available tags from `GET /api/tags`.
    -   `[x] Implement a multi-select component (e.g., using checkboxes or a dedicated library) for assigning tags.
    -   `[x] Send selected `tag_ids` array to `POST /api/apps`.
    -   `[x] Add client-side validation and clear error/success feedback.
-   `[x] UI: Enhance "Edit App" form/modal — @cline`:
    -   `[x] Fetch available tags from `GET /api/tags`.
    -   `[x] Pre-select/pre-fill currently assigned tags for the app being edited.
    -   `[x] Implement a multi-select component for modifying tag assignments.
    -   `[x] Send updated `tag_ids` array to `PUT /api/apps/{appId}`.
    -   `[x] Add client-side validation and clear error/success feedback.
-   `[x] UI: Implement "Delete App" process with confirmation modal — @cline`

### 2.2. Screenshot Management UI (Admin)
-   `[x] Create UI for listing and managing screenshots of a selected app — @cline`
-   `[x] Implement screenshot upload interface with metadata fields — @cline`
-   `[x] UI: Display uploaded screenshots with metadata and edit/delete options — @cline`
-   `[x] UI: Implement form for editing screenshot metadata — @cline`
-   `[x] UI: Implement "Delete Screenshot" process with confirmation modal — @cline`
-   `[x] UI: Implement drag-and-drop for reordering screenshots — @cline`
-   `[x] Task: Add robust client-side validation to screenshot metadata forms (e.g., screen name required, route path format if applicable). — @cline`

### 2.3. Tag Management UI (Admin - New Section)
-   `[x] Create admin page/section for managing global tags (e.g., `/admin/sections/tags`) — @cline`
-   `[x] UI: Fetch and display a table/list of existing tags from `GET /api/tags` with options to edit/delete. — @cline`
-   `[x] UI: Form for creating a new tag (input for name). On submit, call `POST /api/tags`. Handle success/error feedback. — @cline`
-   `[x] UI: Inline editing or modal form for updating an existing tag's name. On submit, call `PUT /api/tags/{tagId}`. Handle success/error feedback. — @cline`
-   `[x] UI: Confirmation dialog and logic for deleting a tag. On confirm, call `DELETE /api/tags/{tagId}`. Handle success/error feedback, especially if the tag is in use. — @cline`

---

## Phase 3: Public User Interface - App Showcase

### 3.1. App Listing Page (`/apps`)
-   `[x] Create Next.js page component (`src/app/[locale]/apps/page.tsx`) — @cline`
-   `[x] Implement client-side data fetching for apps from `GET /api/apps` — @cline`
-   `[x] Design and implement `AppCard` component:
    -   `[x] Display app title, thumbnail, average rating, and link to detail page.
    -   `[x] **ENHANCE:** Display a few key tags on the `AppCard`.
-   `[x] Implement grid/list layout for `AppCard`s — @cline`
-   `[ ] UI: Filtering by Tags:
    -   `[x] Fetch available tags from `GET /api/tags` and display them as clickable filter options (e.g., buttons, checkboxes, multi-select dropdown).
    -   `[x] When tags are selected/deselected, update the `tags` query parameter in the URL (e.g., `?tags=1,2,3`).
    -   `[x] Trigger a refetch of the app list from `GET /api/apps` with the updated `tags` query parameter.
    -   `[x] Provide a "Clear Filters" option.
-   `[x] Implement sorting controls UI — @cline`
-   `[x] Implement pagination (ensure total pages count from API is used) — @cline`
-   `[x] Ensure the app listing page is responsive — @cline`
-   `[x] Task: Add ARIA attributes for filtering and sorting controls for accessibility. — @cline`

### 3.2. App Detail Page (`/apps/{appId}`)
-   `[x] Create Next.js dynamic route page component (`src/app/[locale]/apps/[appId]/page.tsx`) — @cline`
-   `[x] Implement data fetching for specific app details and its screenshots — @cline`
-   `[ ] UI: Display the tags associated with the app prominently (fetched via the enhanced `GET /api/apps/{appId}`).
-   `[x] Display main app information, screenshot gallery/carousel, screenshot metadata, and ratings UI — @cline`
-   `[x] Ensure responsiveness — @cline`

---

## Phase 4: General Components & UX (Refinement)

-   `[x] Create reusable `StarRatingDisplay` component — @cline`
-   `[x] Create reusable `StarRatingInput` component — @cline`
-   `[ ] Task: Review and enhance loading states across all new admin and public pages for better user experience (e.g., use consistent skeleton loaders). — @cline`
-   `[ ] Task: Review and enhance error handling:
    -   `[ ] Ensure all API call errors are caught and displayed gracefully to the user (toasts, inline messages).
    -   `[ ] Provide specific error messages where possible.
-   `[x] Ensure consistent styling and adherence to the existing design system (Basic consistency applied). — @cline`
-   `[ ] Task: Conduct a thorough accessibility review (WCAG compliance) for all new UI elements and flows. Address issues found (keyboard navigation, ARIA, focus, contrast). — @cline`

---

## Phase 5: Testing (Crucial for Prod Ready)

### 5.1. Unit Tests
-   `[x] Write unit tests for `StarRatingDisplay` — @cline`
-   `[ ] Task: Write unit tests for `StarRatingInput`.
-   `[ ] Task: Write unit tests for any new complex utility functions (e.g., data mappers, API request helpers for tags).
-   `[ ] Task: Write unit tests for key frontend logic in components (e.g., filter state management, form validation).

### 5.2. Integration Tests (API Endpoints)
-   `[ ] Task: `GET /api/apps` - Test with no params, with pagination, with sorting, with name/description filter, with tag filter (single and multiple tags).
-   `[ ] Task: `POST /api/apps` - Test app creation with and without tags. Verify response and database state.
-   `[ ] Task: `GET /api/apps/{appId}` - Test fetching an existing app (with its tags) and a non-existent app.
-   `[ ] Task: `PUT /api/apps/{appId}` - Test updating app details and its tags. Verify response and database state.
-   `[ ] Task: `DELETE /api/apps/{appId}` - Test deleting an app. Verify response and related data (tags, screenshots) deletion.
-   `[ ] Task: `GET /api/tags` - Test fetching all tags.
-   `[ ] Task: `POST /api/tags` - Test creating a new tag. Test creating a duplicate tag.
-   `[ ] Task: `PUT /api/tags/{tagId}` - Test updating a tag. Test updating to a duplicate name.
-   `[ ] Task: `DELETE /api/tags/{tagId}` - Test deleting a tag. Verify `zirospace_app_tags` associations are removed.
-   `[ ] Task: Screenshot API Endpoints (`POST /api/apps/{appId}/screenshots`, `GET /api/screenshots/*`, `PUT /api/screenshots/*`, `DELETE /api/screenshots/*`, `POST .../reorder`) - Test all CRUD and reorder operations.
-   `[ ] Task: Rating API Endpoints (`POST /api/apps/{appId}/ratings`, `POST /api/screenshots/{screenshotId}/ratings`) - Test rating submission and average rating calculation.
-   `[ ] Task: Test authentication/authorization for all admin-protected endpoints.

### 5.3. End-to-End (E2E) Tests
-   `[ ] Task: Admin Flow - App Management with Tags:
    -   Log in as admin.
    -   Navigate to app management.
    -   Create a new app, assigning several tags. Verify app appears in list with tags.
    -   Edit the app, change its details and tag associations. Verify changes.
    -   Delete the app. Verify it's removed.
-   `[ ] Task: Admin Flow - Tag Management:
    -   Navigate to tag management.
    -   Create a new tag. Verify it appears.
    -   Edit the tag name. Verify change.
    -   Delete the tag. Verify removal (and that apps no longer show it).
-   `[ ] Task: Admin Flow - Screenshot Management: Test full lifecycle (upload with metadata, edit, reorder, delete).
-   `[ ] Task: Public User Flow - App Discovery & Rating:
    -   Navigate to `/apps`.
    -   Filter apps by one or more tags. Verify results.
    -   Sort apps. Verify order.
    -   Paginate through app list.
    -   Click on an app to go to its detail page.
    -   Verify app details and tags are displayed.
    -   View screenshots in the gallery.
    -   Submit a rating for a screenshot. Verify UI update/feedback.
    -   Submit a rating for the app. Verify UI update/feedback.

---

## Phase 6: Documentation

-   `[ ] Task: Create/Update API documentation for all `apps`, `screenshots`, and `tags` endpoints (request/response, auth, params). Use Swagger/OpenAPI or detailed Markdown.
-   `[ ] Task: Add JSDoc/TSDoc comments to new/complex backend services, frontend components, and hooks, especially those related to tag management and filtering.
-   `[ ] Task: Update project `README.md` or developer documentation with information about the new tag system, admin management, and any setup/configuration required.

---

## Phase 7: Deployment & Operational Readiness

### 7.1. Pre-Deployment Checklist
-   `[ ] Task: Verify all production environment variables are correctly set (Supabase URL/keys, Vercel Blob keys, etc.).
-   `[ ] Task: Ensure all database migrations (including tag-related schema changes and indexes) are finalized and tested for production deployment. Create a rollback plan if necessary.
-   `[ ] Task: Perform a final code review for any obvious issues, commented-out code, or debug statements.
-   `[ ] Task: Ensure all frontend assets are optimized (images, CSS, JS bundles).

### 7.2. Deployment
-   `[ ] Task: Deploy the application to a staging environment (if available) for final UAT.
-   `[ ] Task: Execute database migrations on the staging/production database.
-   `[ ] Task: Deploy the application to the production environment.

### 7.3. Post-Deployment
-   `[ ] Task: Conduct comprehensive smoke testing on the production environment, focusing on the new app showcase and tag features.
-   `[ ] Task: Monitor application logs (Vercel, Supabase) and error tracking systems (if any) for any issues arising post-deployment.
-   `[ ] Task: (If applicable) Announce the new feature to users.

---

## Phase 8: Navigation & UI Finalization (Review)
-   `[x] Add link to public `/apps` in main navbar — @cline`
-   `[x] Add link to admin `/admin/sections/apps` in Admin Dashboard & Sidebar — @cline`
-   `[x] Task: Add link to admin `/admin/sections/tags` (or chosen path) in Admin Dashboard & Sidebar once the page is created. — @cline`
-   `[x] AI-Friendly Structuring Review of this todo.md — @cline`

---

## Phase 9: Admin Panel - CRUD Operations Refinement (Review)
-   `[x] App CRUD Enhancements (Admin UI) review completed. — @cline`
-   `[x] Screenshot CRUD Enhancements (Admin UI) review completed. — @cline`
