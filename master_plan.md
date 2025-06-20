# Audit & Refactoring Plan: Dead Code and Code Smells

This document outlines the findings from a full codebase audit. It identifies dead code, code smells, and provides a concrete action plan for cleanup and refactoring.

## Phase 1: Dead Code and Obsolete File Removal

The following files and components are identified as either unused, obsolete after the Prisma migration, or redundant. They should be removed to reduce clutter and prevent confusion.

-   [ ] **Task 1.1: Delete Obsolete Mock Files.**
    *   **Reasoning:** The project now uses a live database via Prisma, making the mock repository layer obsolete. These files are no longer used and represent a stale implementation pattern.
    *   **Action:** Delete the following files:
        *   `src/lib/__mocks__/caseStudyRepository.mock.ts`
        *   `src/lib/__mocks__/caseStudySliderRepository.mock.ts`

-   [ ] **Task 1.2: Delete Unused Admin Component.**
    *   **Reasoning:** The component `src/app/(admin)/admin/sections/case-studies/case-study-list.tsx` is an old, non-interactive version of the case study list. The active component is `case-studies-interactive.tsx`, which uses drag-and-drop functionality. The old component is dead code.
    *   **Action:** Delete the file:
        *   `src/app/(admin)/admin/sections/case-studies/case-study-list.tsx`

-   [ ] **Task 1.3: Delete Obsolete Test File.**
    *   **Reasoning:** The test file `src/lib/services/service.service.test.ts` is based on the old repository pattern and imports `ServiceDTO`, which has been removed. It no longer reflects the current implementation of `ServiceService` and cannot be run.
    *   **Action:** Delete the file:
        *   `src/lib/services/service.service.test.ts`

## Phase 2: Code Smells and Refactoring

The following issues have been identified as code smells or inconsistencies that should be addressed to improve code quality, maintainability, and correctness.

-   [ ] **Task 2.1: Consolidate RESTful API Routes for `services`.**
    *   **Reasoning (Code Smell):** The `src/app/api/admin/services/route.ts` file currently contains logic for `GET` (all) and `POST`, while the `[id]/route.ts` handles `GET` (by ID), `PUT`, and `DELETE`. However, the client-side hook `useAdminServices` is still pointing all its calls to the non-standard, combined endpoints, which is incorrect and not RESTful. The `[id]/route.ts` is not actually being used.
    *   **Action:**
        1.  In `src/hooks/admin/useAdminServices.ts`, update the `callApi` URLs to use the correct RESTful endpoints:
            *   `getServiceById`: Change URL to `/api/admin/services/${id}?locale=${locale}`.
            *   `updateService`: Change URL to `/api/admin/services/${id}` and send `locale` in the body.
            *   `deleteService`: Change URL to `/api/admin/services/${id}?locale=${locale}` and remove the body.
        2.  In `src/app/api/admin/services/[id]/route.ts`, ensure `PUT` gets locale from the body and `DELETE` gets it from query params to match the hook.
        3.  Verify that `src/app/api/admin/services/route.ts` only contains `GET` (all) and `POST` handlers.

-   [ ] **Task 2.2: Refactor `pinBlogPost` Logic.**
    *   **Reasoning (Code Smell):** The logic to unpin the old post and pin the new one is currently in the API route `src/app/api/admin/blog-post/[id]/pin/route.ts`. This complex business logic should reside in the service layer to be atomic and reusable.
    *   **Action:**
        1.  In `src/lib/services/blog-post.service.ts`, create a new method `pinBlogPost(postIdToPin: string, locale: Locale)`.
        2.  This method must use `prisma.$transaction` to perform two operations atomically:
            *   First, update all posts for the given `locale` to set `isPinned` to `false`.
            *   Second, update the post matching `postIdToPin` to set `isPinned` to `true`.
        3.  Refactor the `POST` handler in `src/app/api/admin/blog-post/[id]/pin/route.ts` to make a single call to the new `blogPostService.pinBlogPost` method.

-   [ ] **Task 2.3: Remove Redundant Handlers from `updates` API Route.**
    *   **Reasoning (Code Smell):** The file `src/app/api/admin/updates/route.ts` contains `PUT` and `DELETE` handlers. This is redundant and error-prone, as the correct implementations already exist in `src/app/api/admin/updates/[id]/route.ts`.
    *   **Action:** Delete the `PUT` and `DELETE` function exports from `src/app/api/admin/updates/route.ts`.

-   [ ] **Task 2.4: Remove Redundant Handlers from `blog-post` API Route.**
    *   **Reasoning (Code Smell):** Similar to the `updates` route, the `src/app/api/admin/blog-post/route.ts` contains `PUT` and `DELETE` handlers that belong in the `[id]` route. This is a leftover from a previous, non-RESTful implementation. The `[id]/route.ts` now correctly handles these.
    *   **Action:** Delete the `PUT` and `DELETE` function exports from `src/app/api/admin/blog-post/route.ts`. The file should only contain `POST` (create) and `GET` (list all).

-   [ ] **Task 2.5: Inconsistent Data Mapping in `case-studies` API Route.**
    *   **Reasoning (Code Smell):** The `POST` handler in `src/app/api/admin/case-studies/route.ts` uses `CaseStudyMapper.toPersistence(data)`. This is incorrect. The frontend `CaseStudyForm` and `useAdminCaseStudies` hook operate on the `CaseStudy` domain model. The service layer's `createCaseStudy` method also expects a `Partial<CaseStudy>`. The mapper is not needed and indicates a layer violation.
    *   **Action:** In `src/app/api/admin/case-studies/route.ts`, remove the call to `CaseStudyMapper.toPersistence(data)` in the `POST` handler and pass the `data` object directly to the service.