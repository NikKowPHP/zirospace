# TODO: Implement Dynamic Service Pages Feature

This feature will allow creating and managing individual service pages, similar to the existing blog functionality, primarily for SEO purposes. Each service page will have its own content (text, images) and URL structure like `/services/[slug]`.

## Phase 1: Backend Setup & Data Management

### 1.1. Define Data Structures
    - [X] **Domain Model**: Create `src/domain/models/service.model.ts`.
        - Fields:
            - `id`: `string` (Primary Key)
            - `slug`: `string` (Unique per locale)
            - `title`: `string`
            - `subtitle?`: `string` (Optional)
            - `contentHtml`: `string` (Rich text content for the service details)
            - `excerpt?`: `string` (Short summary, plain text or simple HTML, optional)
            - `imageUrl?`: `string` (URL for a main image, optional)
            - `imageAlt?`: `string` (Alt text for the main image, optional)
            - `metaTitle?`: `string` (Custom SEO title, optional)
            - `metaDescription?`: `string` (Custom SEO description, optional)
            - `keywords?`: `string[]` (SEO keywords, optional)
            - `isPublished`: `boolean` (Default: `true`)
            - `orderIndex?`: `number` (For custom ordering if a listing page is ever implemented, Default: `0`)
            - `createdAt`: `string` (ISO date string)
            - `updatedAt`: `string` (ISO date string)
        - [ ] Add this model to `src/domain/models/models.ts` for aggregated exports.
    - [X] **DTO**: Create `src/infrastructure/dto/service.dto.ts`.
        - Should mirror the domain model, with dates as strings.
        - Field names should use snake_case if that's the database convention (e.g., `image_url`, `created_at`).
    - [X] **Mapper**: Create `src/infrastructure/mappers/service.mapper.ts`.
        - Implement `ServiceMapper.toDomain(dto: ServiceDTO): Service`
        - Implement `ServiceMapper.toPersistence(domain: Partial<Service>): Partial<ServiceDTO>`

### 1.2. Database Migrations (SQLite for local dev - `MOCK_REPOSITORIES=true`)
    - [X] **Create Table Migration**: Create a new Knex migration file in `migrations/` (e.g., `YYYYMMDDHHMMSS_create_services_tables.js`).
        - Define `services_en` and `services_pl` tables.
        - Columns should align with the `ServiceDTO` (e.g., `id TEXT PRIMARY KEY`, `slug TEXT UNIQUE NOT NULL`, `title TEXT NOT NULL`, `content_html TEXT`, `image_url TEXT`, `created_at TEXT`, `updated_at TEXT`, `is_published BOOLEAN DEFAULT 1`).
    - [ ] **Seed Data Migration (Optional)**: Create a seed file (e.g., `YYYYMMDDHHMMSS_seed_services_tables.js`) to add 1-2 sample services per locale for testing.
    - [ ] Run `npm run migrate:latest` to apply migrations.
    - [ ] (Optional) Update `test_db.js` to query the new service tables for local verification.

### 1.3. Database Migrations (Supabase - if used for prod)
    - [ ] **Create Table SQL**: Create an SQL migration file in `supabase/migrations/` (e.g., `XXX_create_services_tables.sql`).
        - Define `zirospace_services_en` and `zirospace_services_pl` tables.
        - Schema should mirror the SQLite tables (e.g., `id TEXT PRIMARY KEY`, `slug TEXT UNIQUE NOT NULL`, `title TEXT NOT NULL`, `content_html TEXT`, `image_url TEXT`, `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`, `is_published BOOLEAN DEFAULT TRUE`).
    - [ ] **Seed Data SQL (Optional)**: Add `INSERT` statements in a Supabase SQL migration file for sample data.

### 1.4. Repository Layer
    - [X] **Interface**: Create `src/lib/interfaces/service.interface.ts` for `IServiceRepository`.
        - Methods: `getServices(locale: string): Promise<Service[]>`, `getServiceBySlug(slug: string, locale: string): Promise<Service | null>`, `getServiceById(id: string, locale: string): Promise<Service | null>`, `createService(service: Partial<ServiceDTO>, locale: string): Promise<Service>`, `updateService(id: string, service: Partial<ServiceDTO>, locale: string): Promise<Service | null>`, `deleteService(id: string, locale: string): Promise<boolean>`.
    - [X] **Local Repository**: Create `src/lib/repositories/service.local.repository.ts` implementing `IServiceRepository` (using `SqlLiteAdapter`, similar to `BlogPostRepositoryLocal`).
    - [X] **Remote Repository (Supabase)**: Create `src/lib/repositories/service.repository.ts` implementing `IServiceRepository` (using Supabase client, similar to `BlogPostRepository`).
        - Implement `unstable_cache` for `getServices` and `getServiceBySlug`, using a new cache tag.

### 1.5. Service Layer
    - [ ] Create `src/lib/services/service.service.ts`.
        - Implement methods that call the appropriate repository (local or remote based on `MOCK_REPOSITORIES`).
        - Handle any business logic, e.g., automatically generating a slug from the title if not provided, trimming string fields.
    - [X] Update `CACHE_TAGS` in `src/lib/utils/cache.ts`: add `SERVICES: 'services'`.

### 1.6. API Routes
    - [ ] **Main Service API Route**: Create `src/app/api/admin/services/route.ts`.
        - `POST`: Handles creation of a new service. Calls `serviceService.createService`. Revalidates `CACHE_TAGS.SERVICES`.
        - `GET`: Handles fetching a single service by ID and locale (passed as query params). Calls `serviceService.getServiceById`.
        - `PUT`: Handles updating a service by ID (passed as query param). Calls `serviceService.updateService`. Revalidates `CACHE_TAGS.SERVICES`.
        - `DELETE`: Handles deleting a service by ID (passed as query param). Calls `serviceService.deleteService`. Revalidates `CACHE_TAGS.SERVICES`.
        - (Follow the pattern of `src/app/api/admin/blog-post/route.ts`).

## Phase 2: Admin Panel Integration

### 2.1. Admin Context
    - [ ] Update `AdminContextType` in `src/contexts/admin-context.tsx`:
        - Add `services: Record<Locale, Service[]>`.
        - Add `getServices(locale: Locale): Promise<void>`.
        - Add `getServiceById(id: string, locale: Locale): Promise<Service | null>`.
        - Add `createService(data: Partial<Service>, locale: Locale): Promise<void>`.
        - Add `updateService(id: string, data: Partial<Service>, locale: Locale): Promise<void>`.
        - Add `deleteService(id: string, locale: Locale): Promise<void>`.
    - [ ] Implement these new states and methods in `AdminProvider`, mirroring existing patterns for other content types.
    - [ ] Fetch initial services data in `AdminProvider` props if the services admin page is loaded.

### 2.2. Admin Navigation
    - [ ] Add a "Services" link to the admin sidebar in `src/app/(admin)/admin/sections/layout.tsx`.
        - Choose an appropriate Lucide icon (e.g., `Briefcase`, `FileText`, or `LayoutList`).

### 2.3. Services Management UI
    - [ ] Create admin page directory: `src/app/(admin)/admin/sections/services/`.
    - [ ] Create `src/app/(admin)/admin/sections/services/page.tsx`:
        - This page will render `ServiceList`.
        - It should fetch initial services data for the `AdminProvider` when server-rendered.
    - [ ] **Service List Component**: Create `src/app/(admin)/admin/sections/services/service-list.tsx`.
        - Display a table of services (columns: Title, Slug, Excerpt, Published Status, Actions).
        - Include buttons: "Add Service", "Edit", "Delete" for each service.
        - Implement a locale switcher (EN/PL).
        - Use `useAdmin()` to get services and action handlers.
        - Similar structure to `BlogPostList`.
    - [ ] **Service Form Component**: Create `src/app/(admin)/admin/sections/services/components/service-form.tsx`.
        - Form fields for all `Service` model properties: Title, Subtitle, Slug, Excerpt, ContentHTML (use Quill editor), Image URL, Image Alt, Meta Title, Meta Description, Keywords (as a comma-separated string or a tag input), Published (checkbox), Order Index.
        - Handle form submission for creating or updating a service.
        - Similar structure to `BlogPostForm`.
    - [ ] **Create Service Page**: `src/app/(admin)/admin/sections/services/create/page.tsx`.
        - Renders `ServiceForm` for creating new service entries.
        - Handles submission via `useAdmin().createService`.
    - [ ] **Edit Service Page**: `src/app/(admin)/admin/sections/services/edit/[id]/page.tsx`.
        - Fetches the specific service data using `useAdmin().getServiceById(id, locale)`.
        - Renders `ServiceForm` pre-filled with the service data for editing.
        - Handles submission via `useAdmin().updateService`.

## Phase 3: Frontend Display & SEO

### 3.1. Individual Service Page
    - [ ] Create dynamic route: `src/app/[locale]/services/[slug]/page.tsx`.
    - [ ] In `page.tsx`, fetch service data using `serviceService.getServiceBySlug(slug, locale)`.
    - [ ] Display the service's content: `title`, `subtitle` (if any), `imageUrl` (if any), and `contentHtml` (using `dangerouslySetInnerHTML` after sanitization if necessary, or ensure content is safe from editor).
    - [ ] Include publication date (`createdAt`).
    - [ ] If service not found or not published (if `isPublished` logic is added to fetch), return `notFound()`.
    - [ ] **SEO**: Implement `generateMetadata` function:
        - Set page `title` (using `service.metaTitle` or `service.title`).
        - Set page `description` (using `service.metaDescription` or `service.excerpt`).
        - Set `keywords` (using `service.keywords`).
        - Configure OpenGraph and Twitter card metadata (title, description, image).
    - [ ] **Structured Data**: Add JSON-LD script for `Article` or `Service` schema.
        - Include fields like `headline`, `description`, `image`, `datePublished`, `author`, `publisher`.
    - [ ] Style the page appropriately, perhaps similar to `blog-post.module.css` or a new dedicated style.

### 3.2. Sitemap & Robots.txt
    - [ ] Update `src/app/sitemap.ts`:
        - Fetch all published services for each locale.
        - Add URLs for each service page (e.g., `${baseUrl}/${locale}/services/${service.slug}`) to the sitemap.
    - [ ] Update `src/app/robots.ts`:
        - Ensure `/services/` and `/services/*` paths are allowed for crawlers.

## Phase 4: Testing & Refinement
    - [ ] **Admin Panel**:
        - Test creating a new service in EN and PL.
        - Test editing an existing service (all fields).
        - Test deleting a service.
        - Verify rich text editor saves and loads content correctly.
        - Verify image URLs and alt text are saved.
        - Check `isPublished` functionality.
    - [ ] **Frontend Display**:
        - Access a published service page directly by its URL (`/[locale]/services/[slug]`).
        - Verify all content (title, subtitle, main image, HTML content) displays correctly.
        - Check that non-published services return a 404 or are not listed.
        - Verify page titles, meta descriptions, and keywords in the browser's dev tools.
        - Use Google's Rich Results Test or Schema Markup Validator to check JSON-LD.
    - [ ] **Responsive Design**: Test admin forms and frontend service pages on various screen sizes.
    - [ ] **i18n**: Ensure content switching works in admin and frontend (if applicable to service content itself beyond just locale-specific tables).
    - [ ] **Cache Revalidation**: Confirm that creating, updating, or deleting a service correctly revalidates the cache and reflects changes on the frontend.