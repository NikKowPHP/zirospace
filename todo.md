# Todo Plan: App Screenshot Showcase Feature

**Project Rules Reminder:**
- All tasks are initially assigned to `@cline`.
- Mark tasks as `[x] Task description — @cline` upon completion.
- Before starting a task, ensure it's "checked out" (though for AI, this is implicit by starting work).
- Keep this file updated with the progress.

---

## Phase 1: Backend & Data Model Setup

### 1.1. Database Schema Definition
-   `[x] Define `apps` table schema (id, name, description, thumbnail_url, average_rating, created_at, updated_at) — @cline`
-   `[ ] Define `screenshots` table schema (id, app_id (FK to apps), image_url, screen_name, route_path, description, order_index, average_rating, created_at, updated_at) — @cline`
-   `[ ] Define `app_ratings` table schema (id, app_id (FK to apps), user_id (nullable, for identifying unique raters if needed), rating_value (e.g., 1-5), created_at) — @cline`
-   `[ ] Define `screenshot_ratings` table schema (id, screenshot_id (FK to screenshots), user_id (nullable), rating_value (e.g., 1-5), created_at) — @cline`
-   `[x] Create database migrations for the new tables based on the defined schemas — @cline`
-   `[ ] Seed initial data for `apps` and `screenshots` for development and testing purposes (optional) — @cline`

### 1.2. API Endpoint Development (CRUD for Apps)
-   `[x] Create API endpoint: `POST /api/apps` (For admin to create a new app entry. Request body: name, description. Response: created app object) — @cline`
-   `[x] Create API endpoint: `GET /api/apps` (For public to list all apps. Support query parameters for filtering [e.g., by category if added later] and sorting [e.g., `sortBy=rating_desc`, `sortBy=name_asc`]. Response: paginated list of apps) — @cline`
-   `[ ] Implement filtering for GET /api/apps — @cline`
-   `[ ] Implement pagination for GET /api/apps — @cline`
-   `[x] Create API endpoint: `GET /api/apps/{appId}` (For public to get details for a specific app. Response: app object with its details) — @cline`
-   `[x] Create API endpoint: `PUT /api/apps/{appId}` (For admin to update app details. Request body: fields to update. Response: updated app object) — @cline`
-   `[x] Create API endpoint: `DELETE /api/apps/{appId}` (For admin to delete an app. Response: success/failure message) — @cline`

### 1.3. API Endpoint Development (CRUD for Screenshots & Upload)
-   `[ ] Review existing `src/hooks/use-upload.tsx` and `src/app/api/upload/route.ts` to understand current image upload capabilities and integration points — @cline`
-   `[ ] Adapt or Create API endpoint: `POST /api/apps/{appId}/screenshots` (For admin to upload one or more screenshots for an app. Request: FormData with image file(s) and associated metadata [screen_name, route_path, description, order_index] for each. This endpoint will use the Vercel Blob storage via the existing or a new upload handler. Response: array of created screenshot objects) — @cline`
-   `[x] Create API endpoint: `GET /api/apps/{appId}/screenshots` (For public to list all screenshots for a specific app, ordered by `order_index`. Response: list of screenshot objects) — @cline`
-   `[x] Create API endpoint: `GET /api/screenshots/{screenshotId}` (For public/admin to get details for a specific screenshot. Response: screenshot object) — @cline`
-   `[x] Create API endpoint: `PUT /api/screenshots/{screenshotId}` (For admin to update screenshot metadata. Request body: fields to update. Response: updated screenshot object) — @cline`
-   `[x] Create API endpoint: `DELETE /api/screenshots/{screenshotId}` (For admin to delete a screenshot. Response: success/failure message) — @cline`
-   `[x] Implement API endpoint: `POST /api/apps/{appId}/screenshots/reorder` (For admin to update the order of screenshots for an app. Request body: array of screenshot IDs in the new order. Response: success/failure message) — @cline`

### 1.4. API Endpoint Development (Ratings)
-   `[x] Create API endpoint: `POST /api/apps/{appId}/ratings` (For users to submit/update a rating for an app. Request body: `rating_value`, `user_id` [optional]. Response: updated average rating for the app) — @cline`
-   `[x] Create API endpoint: `POST /api/screenshots/{screenshotId}/ratings` (For users to submit/update a rating for a screenshot. Request body: `rating_value`, `user_id` [optional]. Response: updated average rating for the screenshot) — @cline`
-   `[x] Implement backend logic (e.g., database triggers or application-level service) to calculate and update `average_rating` in `apps` and `screenshots` tables whenever a new rating is submitted — @cline`

### 1.5. Authentication & Authorization
-   `[x] Ensure all admin-specific API endpoints (`POST /api/apps`, `PUT /api/apps/{appId}`, `DELETE /api/apps/{appId}`, `POST /api/apps/{appId}/screenshots`, `PUT /api/screenshots/{screenshotId}`, `DELETE /api/screenshots/{screenshotId}`, `POST /api/apps/{appId}/screenshots/reorder`) are protected and require admin privileges. (Basic authentication check implemented) — @cline`

---

## Phase 2: Admin Panel - App & Screenshot Management

### 2.1. App Management UI (Admin)
-   `[x] Create admin page/section for managing apps (e.g., `/admin/apps`) — @cline`
-   `[x] UI: Display a table or list of existing apps with options to edit/delete and manage screenshots — @cline`
-   `[x] UI: Form for creating a new app (inputs for name, description). On submit, call `POST /api/apps` — @cline`
-   `[x] UI: Form for editing an existing app's details. On submit, call `PUT /api/apps/{appId}` — @cline`
-   `[x] UI: Confirmation dialog and logic for deleting an app. On confirm, call `DELETE /api/apps/{appId}` — @cline`

### 2.2. Screenshot Management UI (Admin - within an App's context)
-   `[x] Create UI within the app management section for listing and managing screenshots of a selected app — @cline`
-   `[ ] Develop screenshot upload interface:
    -   `[ ] Integrate `src/hooks/use-upload.tsx` for handling file selection and upload to `POST /api/apps/{appId}/screenshots` — @cline`
    -   `[ ] Allow selection of multiple image files — @cline`
    -   `[ ] Display previews of selected images before upload — @cline`
    -   `[ ] For each image, provide form fields for metadata: `screen_name`, `route_path`, `description` — @cline`
    -   `[ ] Display upload progress for each file or overall batch — @cline`
-   `[x] UI: Display uploaded screenshots with their metadata and options to edit/delete — @cline`
-   `[x] UI: Form for editing screenshot metadata. On submit, call `PUT /api/screenshots/{screenshotId}` — @cline`
-   `[x] UI: Confirmation dialog and logic for deleting a screenshot. On confirm, call `DELETE /api/screenshots/{screenshotId}` — @cline`
-   `[x] UI: Implement drag-and-drop or similar mechanism for reordering screenshots. On save, call `POST /api/apps/{appId}/screenshots/reorder` — @cline`

---

## Phase 3: Public User Interface - App Showcase

### 3.1. App Listing Page (e.g., `/apps`)
-   `[x] Create Next.js page component for the public app listing (e.g., `src/app/[locale]/apps/page.tsx`) — @cline`
-   `[x] Implement data fetching logic (client-side or SSR/SSG) to get apps from `GET /api/apps` — @cline`
-   `[x] Design and implement the `AppCard` component:
    -   `[x] Display app title — @cline`
    -   `[x] Display app thumbnail (use `thumbnail_url` from app data; this could be the first screenshot or a dedicated upload) — @cline`
    -   `[x] Display average app rating (stars or numerical) — @cline`
    -   `[x] CTA button/link navigating to the app detail page (`/apps/{appId}`) — @cline`
-   `[x] Implement a grid or list layout to display `AppCard` components — @cline`
-   `[x] Implement filtering controls UI (e.g., dropdowns for categories if added, text search for name). Update data fetching based on filter selection (Backend filtering TODO) — @cline`
-   `[x] Implement sorting controls UI (e.g., dropdown to sort by name, rating, date added). Update data fetching based on sort selection — @cline`
-   `[x] Implement pagination if the list of apps can be long (Backend total pages TODO) — @cline`
-   `[x] Ensure the app listing page is responsive across various screen sizes — @cline`

### 3.2. App Detail Page (e.g., `/apps/{appId}`)
-   `[x] Create Next.js dynamic route page component (e.g., `src/app/[locale]/apps/[appId]/page.tsx`) — @cline`
-   `[x] Implement data fetching logic to get specific app details (from `GET /api/apps/{appId}`) and its screenshots (from `GET /api/apps/{appId}/screenshots`) — @cline`
-   `[x] Display main app information: name, full description, overall average rating — @cline`
-   `[x] Implement screenshot gallery/carousel:
    -   `[x] Display all screenshots for the app, ordered by `order_index` — @cline`
    -   `[x] Allow navigation (next/previous buttons, thumbnail strip, or swipe on touch devices) — @cline`
    -   `[x] Display the selected screenshot prominently — @cline`
-   `[x] Below or alongside the current screenshot, display its metadata: `screen_name`, `route_path`, `description` — @cline`
-   `[x] Display the average rating for the currently viewed screenshot — @cline`
-   `[x] Implement UI for users to submit a rating for the currently viewed screenshot (e.g., interactive star rating component). On submit, call `POST /api/screenshots/{screenshotId}/ratings` — @cline`
-   `[x] (Optional) Implement UI for users to submit a rating for the app itself on this page. On submit, call `POST /api/apps/{appId}/ratings` — @cline`
-   `[x] Ensure the app detail page is responsive — @cline`

---

## Phase 4: General Components & UX

### 4.1. Reusable Components
-   `[ ] Create a reusable `StarRatingDisplay` component (shows non-interactive stars based on a rating value) — @cline`
-   `[ ] Create a reusable `StarRatingInput` component (allows users to click/tap to select a rating) — @cline`

### 4.2. UI/UX Enhancements
-   `[ ] Implement loading states (e.g., skeleton loaders, spinners) for all data fetching operations on both admin and public pages — @cline`
-   `[ ] Implement robust error handling: display user-friendly error messages for API failures or validation errors (e.g., using toasts from `src/components/ui/toaster.tsx` or inline messages) — @cline`
-   `[ ] Ensure consistent styling and adherence to the existing design system across all new pages and components — @cline`
-   `[ ] Review and implement accessibility best practices (e.g., ARIA attributes, keyboard navigability, focus management, sufficient color contrast) for all interactive elements and content — @cline`

---

## Phase 5: Testing & Documentation

### 5.1. Testing
-   `[ ] Write unit tests for critical utility functions (e.g., rating calculations, data transformations) and complex UI components — @cline`
-   `[ ] Write integration tests for all new API endpoints (verify request/response, status codes, data integrity for CRUD operations, filtering, sorting, ratings) — @cline`
-   `[ ] Perform thorough end-to-end testing of user flows:
    -   `[ ] Admin: Log in, create/edit/delete an app, upload/manage/reorder screenshots, edit screenshot metadata — @cline`
    -   `[ ] Public User: Navigate to `/apps`, view app list, use filters and sorting, navigate to app detail page, view screenshots in gallery, rate a screenshot, rate an app — @cline`

### 5.2. Documentation
-   `[ ] Document all new API endpoints (request/response formats, authentication requirements, query parameters). Consider using a tool like Swagger/OpenAPI or simple markdown files — @cline`
-   `[ ] Add JSDoc comments or similar to complex functions, components, and hooks — @cline`
-   `[ ] Update the project's `README.md` or create a new document outlining the "App Screenshot Showcase" feature, its setup, and usage if necessary — @cline`

---

## Phase 6: Deployment & Review

### 6.1. Deployment Preparation
-   `[ ] Verify and configure all necessary environment variables for production (database connection strings, API keys for Vercel Blob or other services, admin credentials if applicable) — @cline`
-   `[ ] Ensure database migrations are scripted and can be reliably run in the production environment — @cline`

### 6.2. Deployment
-   `[ ] Deploy the feature to the staging/production environment (presumably Vercel) — @cline`
-   `[ ] Conduct post-deployment smoke testing on the live environment to ensure core functionalities are working as expected — @cline`
-   `[ ] Monitor application logs for any immediate issues post-deployment — @cline`
