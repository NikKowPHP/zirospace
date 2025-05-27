# TODO: Refactor Admin Panel and Implement "Updates" Feature

This document outlines the tasks to refactor the admin panel's state management by breaking down `AdminContext` into domain-specific hooks, and then implement the "Updates" feature.

## Phase 1: Refactor `AdminContext` into Domain-Specific Hooks

- [x] **1.1. Define Core Hook Utilities and Pattern**
    - **Task:** Design a reusable pattern for the custom admin hooks. This might include creating shared utilities for API calls (e.g., a `useAdminApi` hook or helper functions) to handle loading states, error handling, and toast notifications consistently across all admin hooks.
    - **Considerations:**
        - How initial data for each domain (e.g., `initialCaseStudies`) will be passed to or fetched by these hooks.
        - Consistent API for CRUD operations (e.g., `createItem`, `updateItem`, `deleteItem`, `getItemById`, `getAllItems`).
        - Centralized `loading` and `error` state management, or per-hook.
    - **Files to Potentially Create/Modify:**
        - `src/hooks/admin/useAdminApi.ts` (or similar utility)
        - Update existing API call patterns if a new utility is introduced.

- [x] **1.2. Create `useAdminCaseStudies` Hook**
    - **Task:** Migrate CaseStudy related state (`caseStudies`) and functions (`createCaseStudy`, `updateCaseStudy`, `deleteCaseStudy`, `updateCaseStudyOrder`) from the existing `AdminContext` to a new dedicated hook.
    - **File:** `src/hooks/admin/useAdminCaseStudies.ts`
    - **API Calls:** Ensure API interactions for case studies are handled within this hook, possibly using the utility from 1.1.

- [x] **1.3. Create `useAdminBlogPosts` Hook**
    - **Task:** Migrate BlogPost related state (`blogPosts`) and functions (`createBlogPost`, `updateBlogPost`, `deleteBlogPost`, `pinBlogPost`, `getBlogPost`) to a new hook.
    - **File:** `src/hooks/admin/useAdminBlogPosts.ts`

- [x] **1.4. Create `useAdminBanners` Hook**
    - **Task:** Migrate Banner related state (`banners`) and functions (`createBanner`, `updateBanner`, `deleteBanner`) to a new hook.
    - **File:** `src/hooks/admin/useAdminBanners.ts`

- [x] **1.5. Create `useAdminServices` Hook**
    - **Task:** Migrate Service related state (`services`) and functions (`createService`, `updateService`, `deleteService`, `getServiceById`, `getServices`) to a new hook.
    - **File:** `src/hooks/admin/useAdminServices.ts`

- [x] **1.6. Create `useAdminTestimonials` Hook**
    - **Task:** Migrate Testimonial related state (`testimonials`) and functions (`createTestimonial`, `updateTestimonial`, `deleteTestimonial`, `getTestimonials`) to a new hook.
    - **File:** `src/hooks/admin/useAdminTestimonials.ts`

- [x] **1.7. Create `useAdminCaseStudySliders` Hook**
    - **Task:** Migrate CaseStudySlider related state (`caseStudySliders`) and functions (`createCaseStudySlider`, `updateCaseStudySlider`, `deleteCaseStudySlider`, `getCaseStudySliders`) to a new hook.
    - **File:** `src/hooks/admin/useAdminCaseStudySliders.ts`

- [x] **1.8. Refactor `AdminProvider` (or replace with individual providers)**
    - **Task:** Modify the existing `AdminProvider` to either:
        1.  Initialize and provide instances of these new hooks.
        2.  Be simplified if hooks manage their own state and are provided individually or via a new, leaner context aggregator.
    - **Considerations:** How `initialData` (e.g., `initialCaseStudies`, `initialBlogPosts`) is passed down and consumed by the new hooks. Hooks might fetch their own initial data if `AdminProvider` no longer handles this.
    - **File:** `src/contexts/admin-context.tsx`

- [x] **1.9. Update Admin Components to Use New Hooks**
    - **Task:** Systematically review and refactor all components currently using the global `useAdmin()` hook.
    - **Action:** Replace `useAdmin()` with the appropriate domain-specific hook(s) (e.g., `useAdminCaseStudies()`, `useAdminBlogPosts()`).
    - **Files to Modify:** All components under `src/app/(admin)/admin/sections/` that currently use `useAdmin()`.

## Phase 2: Implement "Updates" Feature - Database and Core Data Structures

- [x] **2.1. Define Update Item Data Structure**
- [x] **2.2. Create Knex Migration for `updates` Tables**
- [x] **2.3. Create Supabase Migration for `updates` Tables**
- [x] **2.4. Create Knex Seed File for `updates` Tables**
- [x] **2.5. Create Supabase Seed File for `updates` Tables**
- [x] **2.6. Define Data Transfer Object (DTO) for Update**
- [x] **2.7. Define Domain Model for Update**
- [x] **2.8. Create Mapper for Update**
- [x] **2.9. Define Repository Interface for Updates**

## Phase 3: Implement "Updates" Feature - Backend Service and Repository

- [x] **3.1. Implement Supabase `UpdateRepository`**
- [x] **3.2. Implement Local SQLite `UpdateRepositoryLocal`**
- [x] **3.3. Implement `UpdateService`**

## Phase 4: Implement "Updates" Feature - Admin Panel API Endpoints

- [x] **4.1. Create API Routes for Admin Updates (CRUD)**

## Phase 5: Implement "Updates" Feature - Admin Panel UI (Using New Hooks)

- [ ] **5.1. Create `useAdminUpdates` Hook**
    - **Task:** This hook will manage the state and CRUD operations for "Updates", following the pattern established in Phase 1.
    - **File:** `src/hooks/admin/useAdminUpdates.ts`
    - **Content:**
        - State for `updates: Record<Locale, Update[]>`.
        - Functions: `fetchUpdates(locale)`, `createUpdate(data, locale)`, `updateUpdate(id, data, locale)`, `deleteUpdate(id, locale)`, `getUpdateById(id, locale)`.
        - These functions will call the API endpoints defined in Phase 4.
        - Manage `loading` and `error` states specific to Updates.
        - Use `toast.promise` for user feedback.
        - Handle initialization with `initialUpdates` if provided by `AdminProvider`.

- [ ] **5.2. Add "Updates" to Admin Navigation**
    - **Task:** Link in admin sidebar.
    - **File:** `src/app/(admin)/admin/sections/layout.tsx`
    - **Action:** Add `Link` to `/admin/sections/updates` (e.g., `Newspaper` icon from Lucide).

- [ ] **5.3. Create Admin Updates Page Structure**
    - **Task:** Main admin page for Updates.
    - **Directory:** `src/app/(admin)/admin/sections/updates/`
    - **File:** `page.tsx`
    - **Content:**
        - Use the `useAdminUpdates` hook to get `updates`, `loading`, `error` states.
        - `AdminProvider` (if still used for initial data) might provide `initialUpdates` fetched server-side.
        - Render `UpdateList` component.

- [ ] **5.4. Create `UpdateForm` Component**
    - **Task:** Reusable form for create/edit.
    - **File:** `src/app/(admin)/admin/sections/updates/components/update-form.tsx`
    - **Fields:** Title, Slug (auto-generated or manual), Publish Date, Excerpt (Textarea), Content (Quill RTE), Image URL, Image Alt, Is Published (Switch), Order Index.
    - **Props:** `update?: Update` (for editing), `locale: Locale`, `onSubmit: (data: Partial<Update>) => Promise<void>`, `onCancel: () => void`, `loading: boolean`.
    - **Logic:** `onSubmit` will be a function from the parent page, which in turn calls the appropriate method from `useAdminUpdates`. `loading` prop will be derived from `useAdminUpdates().loading`.

- [ ] **5.5. Create `UpdateList` Component**
    - **Task:** Table display for updates.
    - **File:** `src/app/(admin)/admin/sections/updates/update-list.tsx`
    - **Functionality:**
        - Locale tabs for EN/PL.
        - Table columns: Title, Slug, Publish Date, Status (Published/Draft), Actions (Edit/Delete).
        - "Add Update" button.
        - Uses `useAdminUpdates()` to get data (`updates[activeLocale]`) and action handlers (`deleteUpdate`).
        - `loading` state from `useAdminUpdates()` to disable buttons during operations.

- [ ] **5.6. Create "Create Update" Page**
    - **Task:** UI for adding new updates.
    - **Directory:** `src/app/(admin)/admin/sections/updates/create/`
    - **File:** `page.tsx`
    - **Content:**
        - Manages `activeLocale` state.
        - Renders `UpdateForm`.
        - `onSubmit` handler calls `useAdminUpdates().createUpdate(data, activeLocale)`.

- [ ] **5.7. Create "Edit Update" Page**
    - **Task:** UI for editing updates.
    - **Directory:** `src/app/(admin)/admin/sections/updates/edit/[id]/`
    - **File:** `page.tsx`
    - **Content:**
        - Fetches update data using `useAdminUpdates().getUpdateById(id, locale)` in a `useEffect`.
        - Renders `UpdateForm` pre-filled with fetched data.
        - `onSubmit` handler calls `useAdminUpdates().updateUpdate(id, data, locale)`.

## Phase 6: Public-Facing Updates Page (Single Scrollable Page)

- [ ] **6.1. Create Public Route for Updates Page**
    - **Task:** Define the main public URL.
    - **Directory:** `src/app/[locale]/updates/`
    - **File:** `page.tsx`

- [ ] **6.2. Fetch and Display All Updates Sequentially**
    - **Task:** Implement the single-page scrollable view for updates.
    - **File:** `src/app/[locale]/updates/page.tsx`
    - **Implementation:**
        - Server-side: Fetch all *published* updates using `updateService.getUpdates(locale)`.
        - Sort updates by `publish_date` (descending) or `order_index` (ascending) as primary sort.
        - Map through the updates and render each one fully on the page.
        - **Each Update Item Display:** Title, Publish Date, Featured Image (if `image_url`), Full `content_html` (safely rendered).
        - **Styling:** Design for a continuous scroll experience with clear visual separation. Ensure responsiveness.

- [ ] **6.3. Implement `generateMetadata` for the `/updates` Page**
    - **Task:** Add SEO metadata for the single `/updates` page.
    - **File:** `src/app/[locale]/updates/page.tsx`
    - **Content:** General title (e.g., "Updates | Company Name"), overall description for the updates section.
    - **JSON-LD:** `CollectionPage` schema, possibly with `ItemList` or individual `Article`/`NewsArticle` schemas for each item.

- [ ] **6.4. Add "Updates" to Main Navigation (Optional)**
    - **Task:** Link to `/updates` from the main navigation.
    - **Files:** `src/config/navigation.ts`, `src/components/layout/navbar/navbar.tsx`, `messages/en.json`, `messages/pl.json`.

## Phase 7: Styling, Refinements, and Testing

- [ ] **7.1. CSS Styling for Public Updates Page**
    - **Task:** Apply styling for the scrollable public updates page.
    - **Focus:** Readability, visual hierarchy, item separation, responsiveness.

- [ ] **7.2. CSS Styling for Admin Updates Section**
    - **Task:** Ensure admin UI is consistent and user-friendly.

- [ ] **7.3. Error Handling and User Feedback**
    - **Task:** Verify robust error handling in admin and public views.

- [ ] **7.4. Comprehensive Testing**
    - **Task:** Test admin CRUD, public display (content, order, status), responsiveness, SEO.

- [ ] **7.5. Loading States for Public Updates Page**
    - **Task:** Implement a loading state (e.g., skeleton loaders) for the `/updates` page.
    - **File:** `src/app/[locale]/updates/loading.tsx`