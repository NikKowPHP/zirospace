# Services Feature Implementation - Todo List

This document outlines the steps to implement the "Services" feature, including admin panel management and public-facing pages.

## Phase 1: Admin Panel - Services Management UI & Logic

### 1.1. Update Admin Sidebar Navigation [DONE]
-   **Goal:** Add a "Services" link to the admin sidebar for easy access.
-   **File(s):** `src/app/(admin)/admin/sections/layout.tsx`
-   **Task:**
    -   Add a new `<Link>` component for "Services" pointing to `/admin/sections/services`.
    -   Use an appropriate Lucide icon (e.g., `Briefcase` or `Cog`).
    -   Ensure the link is visually consistent with other sidebar items.

### 1.2. Services List View (Admin) - Structure & Display [DONE]
-   **Goal:** Create the main view for listing services in the admin panel, allowing locale switching.
-   **File(s):** `src/app/(admin)/admin/sections/services/page.tsx`, `src/app/(admin)/admin/sections/services/service-list.tsx`
-   **Task:**
    -   In `service-list.tsx`:
        -   Implement locale switching buttons (EN/PL) to filter services by language.
        -   Fetch and display services for the `activeLocale` from `useAdmin()` context.
        *   Render a table with columns: Title, Slug, Published Status (e.g., "Published" / "Draft"), and Actions.
        -   Add an "Add Service" button.
    -   In `page.tsx`:
        *   Ensure `AdminProvider` is set up to provide initial service data if not already done.

### 1.3. "Add Service" Button Navigation [DONE]
-   **Goal:** Enable navigation from the service list to the "create service" page.
-   **File(s):** `src/app/(admin)/admin/sections/services/service-list.tsx`
-   **Task:**
    -   Use `useRouter()` from `next/navigation`.
    -   Wire the "Add Service" button's `onClick` event to navigate to `/admin/sections/services/create`.

### 1.4. "Edit" Button Navigation in List [DONE]
-   **Goal:** Allow navigation from each service row to its corresponding edit page.
-   **File(s):** `src/app/(admin)/admin/sections/services/service-list.tsx`
-   **Task:**
    -   For each service in the list, add an "Edit" button.
    -   Use `useRouter()` to navigate to `/admin/sections/services/edit/[id]?locale=[activeLocale]` on button click.

### 1.5. "Delete" Button Functionality in List [DONE]
-   **Goal:** Enable deletion of services from the list view with confirmation.
-   **File(s):** `src/app/(admin)/admin/sections/services/service-list.tsx`
-   **Task:**
    -   For each service, add a "Delete" button.
    -   On click, show a `window.confirm()` dialog.
    -   If confirmed, call `deleteService(service.id, activeLocale)` from `useAdmin()`.

### 1.6. Service Form Component - Fields & Layout [DONE]
-   **Goal:** Develop a reusable form for creating and editing service details.
-   **File(s):** `src/app/(admin)/admin/sections/services/components/service-form.tsx`
-   **Task:**
    -   Use `react-hook-form` for form state management and validation.
    -   Implement input fields for:
        -   `title` (text, required)
        -   `subtitle` (text, optional)
        -   `slug` (text, required, pattern for valid slugs)
        -   `imageUrl` (text, optional)
        -   `imageAlt` (text, optional, required if `imageUrl` is present)
        -   `metaTitle` (text, optional)
        -   `metaDescription` (textarea, optional)
        -   `keywords` (text input for comma-separated values, to be processed into an array)
        -   `orderIndex` (number, optional, default to 0)
        -   `isPublished` (boolean, using `<Switch />` component, default to true)
    -   Integrate `Quill` rich text editor for `excerpt` (optional) and `contentHtml` (required).
    -   Add "Save" (or "Create"/"Update") and "Cancel" buttons.
    -   Display form validation errors.

### 1.7. Create New Service Page (Admin) [DONE]
-   **Goal:** Set up the page for adding new services.
-   **File(s):** `src/app/(admin)/admin/sections/services/create/page.tsx`
-   **Task:**
    -   Implement locale selection (EN/PL) to determine the language of the service being created.
    -   Render the `ServiceForm` component.
    -   Implement the `onSubmit` handler:
        -   Call `createService(formData, activeLocale)` from `useAdmin()`.
        -   On success, navigate to the service list page (`/admin/sections/services`).
        -   Handle potential errors (e.g., display a toast notification).
    -   Implement the `onCancel` handler to navigate back to `/admin/sections/services`.

### 1.8. Edit Service Page (Admin) [DONE]
-   **Goal:** Set up the page for modifying existing services.
-   **File(s):** `src/app/(admin)/admin/sections/services/edit/[id]/page.tsx`
-   **Task:**
    -   Extract service `id` and `locale` from route parameters/query.
    -   Fetch the existing service data using `getServiceById(id, locale)` from `useAdmin()`.
    -   Pass the fetched service data and `locale` to the `ServiceForm`.
    -   If service data is not found, display a "Service not found" message or redirect.
    -   Implement the `onSubmit` handler:
        -   Call `updateService(id, formData, locale)` from `useAdmin()`.
        -   On success, navigate to the service list page.
        -   Handle errors.
    -   Implement `onCancel` to navigate back.

### 1.9. AdminContext Integration for Services [DONE]
-   **Goal:** Ensure `AdminContext` correctly manages service-related state and API interactions.
-   **File(s):** `src/contexts/admin-context.tsx`
-   **Task:**
    -   Verify `initialServices` prop is used to initialize the `services` state.
    -   Confirm `getServices`, `getServiceById`, `createService`, `updateService`, `deleteService` functions correctly update the internal `services` state upon successful API calls.
    -   Ensure loading states and error handling are robust.

## Phase 2: Frontend - Public Display of Services

### 2.1. Add "Services" to Public Navigation [DONE]
-   **Goal:** Make the "Services" section discoverable from the main website navigation.
-   **File(s):**
    -   `src/config/navigation.ts`
    -   `src/components/layout/navbar/navbar.tsx`
    -   `src/messages/en.json`, `src/messages/pl.json`
-   **Task:**
    -   In `navigationConfig.mainNav`, add an entry for "Services" (e.g., `{ title: 'services', href: '/services', isRoute: true }`).
    -   Ensure `navbar.tsx` correctly renders this link and handles its active state.
    -   Add translations for "Services" in both `en.json` and `pl.json` under the `navigation` key.

### 2.2. Services Listing Page (Public) [DONE]
-   **Goal:** Create a page that lists all published services, similar to the blog index.
-   **File(s):** `src/app/[locale]/services/page.tsx` (Create if it doesn't exist or complete existing)
-   **Task:**
    -   Fetch published services for the current `locale` via `serviceService.getServices(locale)`.
    -   Filter results to show only services where `isPublished` is true.
    -   Sort services by `orderIndex` (ascending).
    -   For each service, display a summary card (e.g., image, title, excerpt).
    -   Each card should link to the individual service page: `/[locale]/services/[slug]`.
    -   Implement `generateMetadata` for static SEO metadata (e.g., "Our Services | ZIRO").
    -   Add JSON-LD for an `ItemList` of services.

### 2.3. Individual Service Page (Public) [DONE]
-   **Goal:** Display the full details of a selected service.
-   **File(s):** `src/app/[locale]/services/[slug]/page.tsx`
-   **Task:**
    -   Fetch the specific service data using `serviceService.getServiceBySlug(slug, locale)`.
    -   If the service is not found or `isPublished` is false, trigger a `notFound()` response.
    -   Display:
        -   `title`
        -   `subtitle` (if available)
        -   `imageUrl` (if available, with `imageAlt`)
        -   Render the `contentHtml` using `dangerouslySetInnerHTML`.
    -   Implement `generateMetadata` for dynamic SEO content based on the service's `metaTitle`, `metaDescription`, and `keywords`.
    -   Implement JSON-LD of type `Service`.

### 2.4. Styling for Service Content (`contentHtml`) [DONE]
-   **Goal:** Ensure content from the rich text editor is well-styled on the public service pages.
-   **File(s):** `src/app/globals.css` or a new dedicated CSS module (e.g., `service-content.css`).
-   **Task:**
    -   Define styles for common HTML elements that will be present in `contentHtml` (e.g., `h1-h6`, `p`, `ul`, `ol`, `li`, `a`, `img`, `blockquote`).
    -   Ensure these styles are consistent with the overall site design and the blog post content styling.

## Phase 3: General & Refinements

### 3.1. Sitemap Integration [DONE]
-   **Goal:** Include service pages in the generated sitemap for SEO.
-   **File(s):** `src/app/sitemap.ts`
-   **Task:**
    -   Add `/services` route to the list of static localized URLs.
    -   Dynamically fetch all published services for each locale.
    -   Add URLs for each individual service (`/[locale]/services/[slug]`) to the sitemap, including `lastModified` and `changeFrequency`.

### 3.2. Robots.txt Update [DONE]
-   **Goal:** Ensure search engine crawlers can access service pages.
-   **File(s):** `src/app/robots.ts`
-   **Task:**
    -   Add `/services` and `/services/*` to the `allow` rules in the `robots.txt` configuration.

### 3.3. Localization Review [DONE]
-   **Goal:** Verify all new UI text related to services (admin panel and public pages) is correctly translated.
-   **File(s):** `src/messages/en.json`, `src/messages/pl.json`, and all components modified/created for the services feature.
-   **Task:**
    -   Identify any hardcoded strings.
    -   Add necessary translation keys to JSON message files.
    -   Use `useTranslations` (client) or `getTranslations` (server) for all display text.

### 3.4. Final Testing (Manual/E2E placeholder) [DONE]
-   **Goal:** Perform basic checks to ensure the feature works as expected.
-   **Task:**
    -   Admin Panel:
        -   Create a new service in EN and PL.
        -   Edit all fields of an existing service.
        -   Delete a service.
        -   Verify rich text editor content saves and loads correctly.
    -   Public Pages:
        -   Access the `/services` listing page, check content and links.
        -   Access individual service pages directly by URL, check content.
        -   Verify 404 for non-existent or unpublished services.
        -   Check basic responsiveness of new pages.

This list should provide a clear path for implementing the services feature.