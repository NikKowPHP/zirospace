# Audit & Refactoring Plan: REST API Correctness and Final Cleanup

This plan has been revised to align with the project's explicit RESTful architecture. The goal is to perfect the existing API routes, improve service-layer code, and remove legacy configurations without migrating to Server Actions.

## Phase 1: Dead Code and Obsolete File Removal

This phase remains critical for reducing the project's surface area and removing confusion.


-   [ ] **Task 1.2: Delete Unused Admin Component.**
    *   **Reasoning:** `case-study-list.tsx` is a non-interactive legacy component superseded by `case-studies-interactive.tsx`.
    *   **Action:** Delete the file:
        *   `src/app/(admin)/admin/sections/case-studies/case-study-list.tsx`

-   [ ] **Task 1.3: Delete Obsolete Test File.**
    *   **Reasoning:** `service.service.test.ts` is based on the old, now-removed repository pattern and DTOs. It is no longer runnable.
    *   **Action:** Delete the file:
        *   `src/app/(admin)/admin/sections/services/service-list.test.tsx`

## Phase 2: Service Layer & API Route Refinements

This phase focuses on improving the correctness, type safety, and efficiency of the existing services and their API route consumers.



-   [ ] **Task 2.2: Refactor `getActiveBanner` Service Logic for Efficiency.**
    *   **Reasoning (Inefficiency):** The `getActiveBanner` method in `banner.service.ts` includes a redundant `locale` filter in its `where` clause. The `getModel(locale)` function already selects the correct table, so the extra filter is unnecessary.
    *   **Action:** In `src/lib/services/banner.service.ts`, modify the `where` clause in the `getActiveBanner` method from `{ isActive: true, locale }` to just `{ isActive: true }`.

-   [ ] **Task 2.3: Encapsulate `pinBlogPost` Business Logic in the Service Layer.**
    *   **Reasoning (Best Practice):** The complex logic for pinning a blog post (un-pinning the old, pinning the new) currently resides in the API route. This is business logic that should be in the service layer to ensure it's atomic and reusable.
    *   **Action:**
        1.  In `src/lib/services/blog-post.service.ts`, create a new method: `pinBlogPost(postIdToPin: string, locale: Locale): Promise<BlogPost>`.
        2.  Inside this new method, use `prisma.$transaction` to perform the two required updates (un-pinning the old post and pinning the new one) as a single, atomic operation.
        3.  Refactor the `POST` handler in `src/app/api/admin/blog-post/[id]/pin/route.ts` to make a single, clean call to this new `blogPostService.pinBlogPost` method.

-   [ ] **Task 2.4: Remove Redundant Handlers from Root API Routes.**
    *   **Reasoning (Code Smell):** The `updates` and `blog-post` root API routes (`/api/admin/updates/route.ts` and `/api/admin/blog-post/route.ts`) contain redundant `PUT` and `DELETE` handlers that are correctly implemented in their respective `[id]` routes. This is a leftover from a previous implementation and can cause bugs.
    *   **Action:**
        1.  Delete the `PUT` and `DELETE` function exports from `src/app/api/admin/updates/route.ts`.
        2.  Delete the `PUT` and `DELETE` function exports from `src/app/api/admin/blog-post/route.ts`.

## Phase 3: Configuration and Final Cleanup

This phase removes legacy configurations and commented-out code.

-   [ ] **Task 3.1: Remove Obsolete `middleware.ts` Logic.**
    *   **Reasoning (Dead Code):** The `middleware.ts` file contains a large, commented-out section for handling 404 redirects which is no longer in use.
    *   **Action:** Delete the entire commented-out block within `middleware.ts`.

-   [ ] **Task 3.2: Simplify `next.config.js`.**
    *   **Reasoning (Legacy Configuration):** The custom `webpack` configuration for `splitChunks` and the `critters` installation script are legacy optimizations that are now handled more effectively by modern versions of Next.js. They add unnecessary complexity.
    *   **Action:**
        1.  In `next.config.js`, remove the entire `webpack` function override.
        2.  Remove the `try/catch` block that installs and requires `critters`.