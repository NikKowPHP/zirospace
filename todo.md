# Todo Plan: App Screenshot Showcase Feature & Tag Integration

**Project Rules Reminder:**
- All tasks are initially assigned to `@cline`.
- Mark tasks as `[x] Task description — @cline` upon completion.
- Keep this file updated with the progress.

---

## Phase 1: Backend & Data Model Setup (Partially Completed, Tag Fixes Needed)

### 1.1. Database Schema Definition (Mostly Done)
-   `[x] Define `apps` table schema (renamed to `zirospace_apps`) — @cline`
-   `[x] Define `tags` table schema (renamed to `zirospace_tags`) — @cline`
-   `[x] Define `app_tags` linking table schema (renamed to `zirospace_app_tags`) — @cline`
-   `[x] Define `screenshots` table schema (renamed to `zirospace_screenshots`) — @cline`
-   `[x] Define `app_ratings` table schema (renamed to `zirospace_app_ratings`) — @cline`
-   `[x] Define `screenshot_ratings` table schema (renamed to `zirospace_screenshot_ratings`) — @cline`
-   `[x] Create database migrations for the new tables based on the defined schemas — @cline`
-   `[x] Seed initial data for `zirospace_apps` and `zirospace_screenshots` — @cline`
-   `[x] Seed initial data for `zirospace_tags` and `zirospace_app_tags` — @cline`

### 1.2. API Endpoint Development (CRUD for Apps - Tag Fetching Fix)
-   `[ ] **FIX:** Update `GET /api/apps` (in `src/app/api/apps/route.ts`):
    -   `[ ] Modify Supabase query to correctly fetch associated tags using the join table: `zirospace_apps(*, zirospace_app_tags(zirospace_tags(id, name)))`.
    -   `[ ] Implement data mapping logic within the API route to transform the nested Supabase response for tags into a flat `tags: [{id: number, name: string}, ...]` array directly on the app object, matching the `App` domain model.
-   `[x] Create API endpoint: `POST /api/apps` — @cline`
-   `[x] Implement filtering for GET /api/apps (initial name/description search) — @cline`
-   `[x] Implement pagination for GET /api/apps — @cline`
-   `[x] Create API endpoint: `GET /api/apps/{appId}` — @cline`
-   `[x] Create API endpoint: `PUT /api/apps/{appId}` — @cline`
-   `[x] Create API endpoint: `DELETE /api/apps/{appId}` — @cline`

### 1.3. API Endpoint Development (CRUD for Screenshots & Upload - Mostly Done)
-   `[x] Review existing `src/hooks/use-upload.tsx` and `src/app/api/upload/route.ts` — @cline`
-   `[x] Create API endpoint: `POST /api/apps/{appId}/screenshots` — @cline`
-   `[x] Create API endpoint: `GET /api/apps/{appId}/screenshots` — @cline`
-   `[x] Create API endpoint: `GET /api/screenshots/{screenshotId}` — @cline`
-   `[x] Create API endpoint: `PUT /api/screenshots/{screenshotId}` — @cline`
-   `[x] Create API endpoint: `DELETE /api/screenshots/{screenshotId}` — @cline`
-   `[x] Implement API endpoint: `POST /api/apps/{appId}/screenshots/reorder` — @cline`

### 1.4. API Endpoint Development (Ratings - Mostly Done)
-   `[x] Create API endpoint: `POST /api/apps/{appId}/ratings` — @cline`
-   `[x] Create API endpoint: `POST /api/screenshots/{screenshotId}/ratings` — @cline`
-   `[x] Implement backend logic to calculate and update `average_rating` — @cline`

### 1.5. API Endpoint Development (Tags - CRUD for Admin)
-   `[ ] Create API endpoint: `GET /api/tags` (For fetching all available tags, e.g., for admin panel multi-select and public filtering UI. Response: `[{id: number, name: string}, ...]`) — @cline`
-   `[ ] Create API endpoint: `POST /api/tags` (Admin: Create a new tag. Request: `{name: string}`. Response: created tag object) — @cline`
-   `[ ] Create API endpoint: `PUT /api/tags/{tagId}` (Admin: Update a tag name. Request: `{name: string}`. Response: updated tag object) — @cline`
-   `[ ] Create API endpoint: `DELETE /api/tags/{tagId}` (Admin: Delete a tag. Also handles removing associations from `zirospace_app_tags`. Response: success/failure) — @cline`

### 1.6. Backend Logic for App Tag Management
-   `[ ] Modify `POST /api/apps` (app creation):
    -   `[ ] Accept an optional `tag_ids: number[]` in the request body.
    -   `[ ] After creating the app in `zirospace_apps`, insert corresponding entries into `zirospace_app_tags`.
-   `[ ] Modify `PUT /api/apps/{appId}` (app update):
    -   `[ ] Accept an optional `tag_ids: number[]` in the request body.
    -   `[ ] When `tag_ids` are provided, clear existing tags for the app from `zirospace_app_tags` and insert the new ones. (Consider transaction for atomicity).

### 1.7. Authentication & Authorization (Basic Implemented)
-   `[x] Ensure all admin-specific API endpoints are protected. (Basic authentication check implemented) — @cline`
-   `[ ] Refine authorization checks if more granular roles are introduced later. — @cline`

---

## Phase 2: Admin Panel - App & Screenshot Management (Tag UI Needed)

### 2.1. App Management UI (Admin)
-   `[x] Create admin page/section for managing apps (`/admin/apps` or `/admin/sections/apps`) — @cline`
-   `[x] UI: Display a table or list of existing apps — @cline`
-   `[ ] UI: In "Create App" form (`src/app/(admin)/admin/sections/apps/page.tsx` or similar):
    -   `[ ] Fetch available tags from `GET /api/tags`.
    -   `[ ] Add a multi-select component (or checkbox group) to assign tags to the new app.
    -   `[ ] Send selected `tag_ids` to `POST /api/apps`.
-   `[ ] UI: In "Edit App" form/modal:
    -   `[ ] Fetch available tags from `GET /api/tags`.
    -   `[ ] Pre-select currently assigned tags for the app.
    -   `[ ] Add/Update multi-select component to modify tag assignments.
    -   `[ ] Send selected `tag_ids` to `PUT /api/apps/{appId}`.
-   `[x] UI: Form for creating a new app — @cline`
-   `[x] UI: Form for editing an existing app's details — @cline`
-   `[x] UI: Confirmation dialog and logic for deleting an app — @cline`

### 2.2. Screenshot Management UI (Admin - Mostly Done)
-   `[x] Create UI within the app management section for listing and managing screenshots — @cline`
-   `[x] Develop screenshot upload interface — @cline`
-   `[x] UI: Display uploaded screenshots with their metadata and options to edit/delete — @cline`
-   `[x] UI: Form for editing screenshot metadata — @cline`
-   `[x] UI: Confirmation dialog and logic for deleting a screenshot — @cline`
-   `[x] UI: Implement drag-and-drop for reordering screenshots — @cline`

### 2.3. Tag Management UI (Admin - New Section)
-   `[ ] Create admin page/section for managing tags (e.g., `/admin/tags` or `/admin/sections/tags`) — @cline`
-   `[ ] UI: Display a table/list of existing tags with options to edit/delete.
-   `[ ] UI: Form for creating a new tag (input for name). On submit, call `POST /api/tags`.
-   `[ ] UI: Form for editing an existing tag's name. On submit, call `PUT /api/tags/{tagId}`.
-   `[ ] UI: Confirmation dialog and logic for deleting a tag. On confirm, call `DELETE /api/tags/{tagId}`.

---

## Phase 3: Public User Interface - App Showcase (Tag Display & Filtering Needed)

### 3.1. App Listing Page (e.g., `/apps`)
-   `[x] Create Next.js page component (`src/app/[locale]/apps/page.tsx`) — @cline`
-   `[x] Implement data fetching for apps (client-side) — @cline`
-   `[x] Design and implement `AppCard` component — @cline`
-   `[x] Implement grid/list layout for `AppCard`s — @cline`
-   `[ ] UI: Fetch and display available tags (from `GET /api/tags`) as clickable filter options (e.g., buttons, checkboxes).
-   `[ ] UI: When tags are selected/deselected, update the `tags` query parameter for `GET /api/apps` and refetch app list.
-   `[x] Implement sorting controls UI — @cline`
-   `[x] Implement pagination — @cline`
-   `[x] Ensure responsiveness — @cline`

### 3.2. App Detail Page (e.g., `/apps/{appId}`)
-   `[x] Create Next.js dynamic route page component (`src/app/[locale]/apps/[appId]/page.tsx`) — @cline`
-   `[x] Implement data fetching for specific app details and screenshots — @cline`
-   `[ ] UI: Display the tags associated with the app (fetched via the updated `GET /api/apps/{appId}` or the main app list fetch if data is passed).
-   `[x] Display main app information — @cline`
-   `[x] Implement screenshot gallery/carousel — @cline`
-   `[x] Display screenshot metadata and average rating — @cline`
-   `[x] Implement UI for rating screenshots — @cline`
-   `[x] (Optional) Implement UI for rating the app itself — @cline`
-   `[x] Ensure responsiveness — @cline`

---

## Phase 4: General Components & UX (Ongoing)
-   `[x] Create `StarRatingDisplay` component — @cline`
-   `[x] Create `StarRatingInput` component — @cline`
-   `[x] Implement loading states (Basic indicators added) — @cline`
-   `[x] Implement robust error handling (Basic toast handling added) — @cline`
-   `[x] Ensure consistent styling (Basic consistency applied) — @cline`
-   `[x] Review and implement accessibility best practices (Basic practices applied) — @cline`

---

## Phase 5: Testing & Documentation (Partially Done)
-   `[x] Write unit tests (Basic test for StarRatingDisplay added) — @cline`
-   `[ ] Write integration tests for all API endpoints, especially focusing on tag-related operations and filtering.
-   `[ ] Perform thorough end-to-end testing:
    -   `[ ] Admin: CRUD apps with tags, CRUD tags themselves.
    -   `[ ] Public User: Filter apps by tags, view tags on app detail page.
-   `[ ] Document new/updated API endpoints related to tags.
-   `[ ] Add JSDoc comments for tag-related logic.

---

## Phase 6: Deployment & Review (Future)
-   `[ ] Verify environment variables.
-   `[ ] Ensure database migrations (especially tag-related ones) are production-ready.
-   `[ ] Deploy and conduct post-deployment smoke testing.
-   `[ ] Monitor logs.

---

## Phase 7: Navigation & UI Finalization (Mostly Done)
-   `[x] Add link to public `/apps` in main navbar — @cline`
-   `[x] Add link to admin `/admin/apps` in Admin Dashboard & Sidebar — @cline`
-   `[ ] Add link to admin `/admin/tags` (or `/admin/sections/tags`) in Admin Dashboard & Sidebar once created.
-   `[x] Review navigation links. — @cline`
-   `[x] AI-Friendly Structuring Review — @cline`

---

## Phase 8: Admin Panel - CRUD Operations Refinement (Mostly Done)
-   `[x] App CRUD Enhancements (Admin UI) completed. — @cline`
-   `[x] Screenshot CRUD Enhancements (Admin UI) completed. — @cline`