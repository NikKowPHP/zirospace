# TODO: Implement "Updates" Feature

This feature will create a new section on the website, `/updates`, where users can scroll through all updates chronologically on a single page. The content for these updates will be fully manageable from the admin panel.

## Phase 1: Database and Core Data Structures

- [x] **1.1. Define Update Item Data Structure**
    - **Task:** Finalize the fields for an "Update" item.
    - **Fields:**
        - `id`: TEXT PRIMARY KEY (UUID)
        - `slug`: TEXT UNIQUE NOT NULL (URL-friendly identifier, though primarily for admin/internal use if it's a single page scroll)
        - `title`: TEXT NOT NULL
        - `publish_date`: TIMESTAMPTZ NOT NULL (Date and time of publication)
        - `content_html`: TEXT (Rich text content for the update body)
        - `excerpt`: TEXT (Short summary or teaser, might be used for meta description or internal admin list)
        - `image_url`: TEXT (Optional URL for a featured image)
        - `image_alt`: TEXT (Optional alt text for the image)
        - `is_published`: BOOLEAN DEFAULT FALSE
        - `order_index`: INTEGER DEFAULT 0 (For manual ordering if needed, otherwise sort by `publish_date`)
        - `created_at`: TIMESTAMPTZ DEFAULT NOW()
        - `updated_at`: TIMESTAMPTZ DEFAULT NOW()
    - **Consideration:** Create `updates_en` and `updates_pl` tables for multilingual support.

- [x] **1.2. Create Knex Migration for `updates` Tables**
    - **Task:** Create a new Knex migration file.
    - **File:** `migrations/YYYYMMDDHHMMSS_create_updates_tables.js`
    - **Schema for `updates_en` & `updates_pl`:**
        - Define columns as per 1.1.
        - `exports.up` should create both tables (`updates_en`, `updates_pl`).
        - `exports.down` should drop both tables.

- [x] **1.3. Create Supabase Migration for `updates` Tables**
    - **Task:** Create a new Supabase migration SQL file.
    - **File:** `supabase/migrations/YYYYMMDDHHMMSS_create_updates_tables.sql`
    - **SQL:**
        - Write `CREATE TABLE` statements for `zirospace_updates_en` and `zirospace_updates_pl` matching the schema from 1.1.
        - Ensure `RLS` is enabled and appropriate policies are set for public read access (if Supabase is used for production direct client access, though admin API is primary).

- [x] **1.4. Create Knex Seed File for `updates` Tables**
    - **Task:** Create a Knex seed file with comprehensive sample data.
    - **File:** `seeds/NN_seed_updates.js` (e.g., `02_seed_updates.js`)
    - **Content:**
        - `exports.seed = async function(knex) { ... }`
        - Delete existing data from `updates_en` and `updates_pl`.
        - Insert 3-5 sample updates for `updates_en` and `updates_pl`.
            - Use realistic titles, HTML content (with paragraphs, headings, lists, blockquotes), and excerpts.
            - Use `https://picsum.photos/seed/{some_unique_seed_for_each_image}/800/400` for `image_url`.
            - Vary `publish_date` to test ordering.
            - Set some `is_published` to true, some to false.
            - Include `order_index` if manual ordering is a priority.

- [x] **1.5. Create Supabase Seed File for `updates` Tables**
    - **Task:** Create a Supabase seed SQL file.
    - **File:** `supabase_migrations/seed_updates_zirospace.sql` (or a new file in `supabase/seed.sql` if preferred structure)
    - **SQL:**
        - Write `INSERT INTO` statements for `zirospace_updates_en` and `zirospace_updates_pl`.
        - Mirror the comprehensive data from the Knex seed file (1.4), adjusting syntax for SQL.
        - Use picsum.photos URLs for images.

- [x] **1.6. Define Data Transfer Object (DTO) for Update**
    - **Task:** Create the DTO for update data.
    - **File:** `src/infrastructure/dto/update.dto.ts`
    - **Interface:** `UpdateDTO` (matching database columns, dates as strings).

- [x] **1.7. Define Domain Model for Update**
    - **Task:** Create the domain model.
    - **File:** `src/domain/models/update.model.ts`
    - **Interface:** `Update` (add to `src/domain/models/models.ts`).

- [x] **1.8. Create Mapper for Update**
    - **Task:** Implement `UpdateMapper`.
    - **File:** `src/infrastructure/mappers/update.mapper.ts`
    - **Class:** `UpdateMapper` (`toDomain`, `toPersistence`).

- [x] **1.9. Define Repository Interface for Updates**
    - **Task:** Specify `IUpdatesRepository`.
    - **File:** `src/lib/interfaces/updatesRepository.interface.ts`
    - **Methods:** `getUpdates`, `getUpdateBySlug`, `getUpdateById`, `createUpdate`, `updateUpdate`, `deleteUpdate`.

## Phase 2: Backend Service and Repository Implementation

- [x] **2.1. Implement Supabase `UpdateRepository`**
    - **Task:** Create Supabase repository.
    - **File:** `src/lib/repositories/update.repository.ts`
    - **Implement:** `IUpdatesRepository` methods using Supabase client.
    - **Caching:** Use `unstable_cache` for read operations.
    - **New Cache Tag:** Add `UPDATES` to `CACHE_TAGS` in `src/lib/utils/cache.ts`.

- [x] **2.2. Implement Local SQLite `UpdateRepositoryLocal`**
    - **Task:** Create SQLite repository.
    - **File:** `src/lib/repositories/update.local.repository.ts`
    - **Implement:** `IUpdatesRepository` methods using `SqlLiteAdapter`.

- [x] **2.3. Implement `UpdateService`**
    - **Task:** Create the service layer.
    - **File:** `src/lib/services/update.service.ts`
    - **Implement:** Business logic (slug generation, date defaults, trimming).
    - **Dependency Injection:** Based on `process.env.MOCK_REPOSITORIES`.

## Phase 3: Admin Panel - API Endpoints

- [ ] **3.1. Create API Routes for Admin Updates (CRUD)**
    - **Task:** Set up API endpoints for admin.
    - **Directory:** `src/app/api/admin/updates/`
    - **List/Create Route:** `route.ts`
        - `POST /api/admin/updates`: Creates an update.
        - `GET /api/admin/updates?locale=xx`: Fetches all updates for admin list.
    - **ID-specific Route:** `[id]/route.ts`
        - `GET /api/admin/updates/[id]?locale=xx`: Fetches single update by ID.
        - `PUT /api/admin/updates/[id]?locale=xx`: Updates an update.
        - `DELETE /api/admin/updates/[id]?locale=xx`: Deletes an update.
    - **Revalidation:** Call `revalidateTag(CACHE_TAGS.UPDATES)` on POST, PUT, DELETE.
    - **Zod Validation:** Implement Zod schemas for request validation.

## Phase 4: Admin Panel - User Interface

- [ ] **4.1. Add "Updates" to Admin Navigation**
    - **Task:** Link in admin sidebar.
    - **File:** `src/app/(admin)/admin/sections/layout.tsx`
    - **Action:** Add `Link` to `/admin/sections/updates` (e.g., `Newspaper` icon).

- [ ] **4.2. Update `AdminContext` for Updates**
    - **Task:** Integrate updates into admin state.
    - **File:** `src/contexts/admin-context.tsx`
    - **Actions:**
        - Add `updates: Record<Locale, Update[]>` and `initialUpdates`.
        - Implement context methods (`getUpdates`, `createUpdate`, `updateUpdate`, `deleteUpdate`, `getUpdateById`) calling Phase 3 APIs. Use `toast.promise`.

- [ ] **4.3. Create Admin Updates Page Structure**
    - **Task:** Main admin page for Updates.
    - **Directory:** `src/app/(admin)/admin/sections/updates/`
    - **File:** `page.tsx`
    - **Content:** Fetch initial data via `updateService`, pass to `AdminProvider`, render `UpdateList`.

- [ ] **4.4. Create `UpdateForm` Component**
    - **Task:** Reusable form for create/edit.
    - **File:** `src/app/(admin)/admin/sections/updates/components/update-form.tsx`
    - **Fields:** Title, Slug, Publish Date, Excerpt (Textarea), Content (Quill), Image URL, Image Alt, Is Published (Switch), Order Index.
    - **Props:** `update?`, `locale`, `onSubmit`, `onCancel`, `loading`.

- [ ] **4.5. Create `UpdateList` Component**
    - **Task:** Table display for updates.
    - **File:** `src/app/(admin)/admin/sections/updates/update-list.tsx`
    - **Functionality:** Locale tabs, table (Title, Slug, Publish Date, Status, Actions), Add/Edit/Delete buttons.

- [ ] **4.6. Create "Create Update" Page**
    - **Task:** UI for adding new updates.
    - **Directory:** `src/app/(admin)/admin/sections/updates/create/`
    - **File:** `page.tsx`
    - **Content:** `UpdateForm`, locale switching, submit via `AdminContext.createUpdate`.

- [ ] **4.7. Create "Edit Update" Page**
    - **Task:** UI for editing updates.
    - **Directory:** `src/app/(admin)/admin/sections/updates/edit/[id]/`
    - **File:** `page.tsx`
    - **Content:** Fetch data via `AdminContext.getUpdateById`, `UpdateForm` pre-filled, submit via `AdminContext.updateUpdate`.

## Phase 5: Public-Facing Updates Page (Single Scrollable Page)

- [ ] **5.1. Create Public Route for Updates Page**
    - **Task:** Define the main public URL.
    - **Directory:** `src/app/[locale]/updates/`
    - **File:** `page.tsx` (This will be the single scrollable page).

- [ ] **5.2. Fetch and Display All Updates Sequentially**
    - **Task:** Implement the single-page scrollable view for updates.
    - **File:** `src/app/[locale]/updates/page.tsx`
    - **Implementation:**
        - Fetch all *published* updates using `updateService.getUpdates(locale)`.
        - Sort updates by `publish_date` (descending) or `order_index` (ascending) as primary sort.
        - Map through the updates and render each one fully on the page, one after another.
        - **Each Update Item Display:**
            - Title (`<h2>` or `<h3>`)
            - Publish Date (formatted)
            - Featured Image (if `image_url` exists, styled appropriately)
            - Full `content_html` (rendered safely).
        - **Styling:** Design for a continuous scroll experience. Consider clear visual separation between update items. Ensure responsiveness.
        - **No individual slug pages:** All content is on this one page.

- [ ] **5.3. Implement `generateMetadata` for the `/updates` Page**
    - **Task:** Add SEO metadata for the single `/updates` page.
    - **File:** `src/app/[locale]/updates/page.tsx`
    - **Content:** General title (e.g., "Updates | Company Name"), overall description for the updates section.
    - **JSON-LD:** `CollectionPage` schema, possibly with `ItemList` containing summaries of each update if beneficial (or focus `Article`/`NewsArticle` for each item within the page structure).

- [ ] **5.4. Add "Updates" to Main Navigation (Optional)**
    - **Task:** Link to `/updates` from the main navigation.
    - **Files:** `src/config/navigation.ts`, `src/components/layout/navbar/navbar.tsx`, `messages/en.json`, `messages/pl.json`.

## Phase 6: Styling, Refinements, and Testing

- [ ] **6.1. CSS Styling for Public Updates Page**
    - **Task:** Apply styling for the single, scrollable public updates page.
    - **Focus:** Readability, visual hierarchy for each update item, separation between items, and overall flow.

- [ ] **6.2. CSS Styling for Admin Updates Section**
    - **Task:** Ensure admin UI is consistent and user-friendly.

- [ ] **6.3. Error Handling and User Feedback**
    - **Task:** Verify robust error handling and feedback in admin and (if applicable) public views.

- [ ] **6.4. Comprehensive Testing**
    - **Task:** Test admin CRUD, public display (correct content, order, published status), responsiveness, and SEO.

- [ ] **6.5. Loading States for Public Updates Page**
    - **Task:** Implement a loading state (e.g., skeleton loaders for a few update items) while data is being fetched for the `/updates` page.
    - **File:** `src/app/[locale]/updates/loading.tsx`