### **Revised Part 2: Deprecate and Remove Old Infrastructure (Detailed Steps & Commands)**

This part focuses on surgically removing all obsolete files and dependencies to clean the project slate before introducing Prisma logic.

*   `[ ]` **Task 2.1: Uninstall Old Dependencies.**
    *   **Action:** Run the following command in your terminal to remove Knex and SQLite from your project's dependencies.
    *   **Command:**
        ```bash
        npm uninstall knex sqlite3
        ```

*   `[ ]` **Task 2.2: Delete All Knex, Migration, and Seeding Files.**
    *   **Action:** These directories and files are central to the old Knex setup and must be removed.
    *   **Command:**
        ```bash
        rm -rf knexfile.mjs migrations/ seeds/
        ```

*   `[ ]` **Task 2.3: Delete Old Repository and Data Access Layer.**
    *   **Action:** This is the core of the pattern shift. We are removing the entire repository abstraction layer, including local (SQLite) and remote implementations, interfaces, and DTOs/Mappers. Prisma's client and generated types will replace them.
    *   **Command:**
        ```bash
        rm -rf src/lib/repositories/ src/lib/interfaces/ src/infrastructure/dto/ src/infrastructure/mappers/
        ```

*   `[ ]` **Task 2.4: Delete Obsolete Configuration and Test Files.**
    *   **Action:** Remove the remaining configuration files, the old database file, and any obsolete server action files that will be consolidated.
    *   **Command:**
        ```bash
        rm -f src/lib/config/database.config.ts src/lib/data/sql/sqlite.db test_db.mjs src/lib/server-actions/casestudy.actions.ts
        ```

*   `[ ]` **Task 2.5: Remove Supabase and Docker-related Files.**
    *   **Action:** Since we are moving to a direct-to-database model with Prisma, the Supabase-specific migration folders and all Docker configurations are no longer needed.
    *   **Command:**
        ```bash
        rm -rf supabase/ supabase_migrations/ docker/ docker-compose.proxy.yml Dockerfile.proxy
        ```

*   `[ ]` **Task 2.6: Sanitize Supabase Client Module.**
    *   **Action:** Open `src/lib/supabase.ts`. This file should now **only** be used for Supabase Auth. Remove the `supabaseAdmin` export and any other data-related helper functions.
    *   **Verification:** The file should be minimal, essentially just exporting the public client for authentication.

---

### **Revised Part 3: Refactor Core Logic to Use Prisma (Detailed Steps & Code Examples)**

This part details the process of rewriting data logic using Prisma and implementing the new caching strategy.

*   `[ ]` **Task 3.1: Refactor Service Layer with Prisma and Caching.**
    *   **Action:** For each file in `src/lib/services/`, you will replace the repository calls with direct Prisma Client queries and wrap them in `unstable_cache`.

    *   **Example: Refactoring `case-study.service.ts`**

        1.  **Open:** `src/lib/services/case-study.service.ts`
        2.  **Modify Imports:**
            ```typescript
            // REMOVE these imports
            // import { CaseStudyRepository } from "../repositories/caseStudy.repository"
            // import { ICaseStudyRepository } from "../interfaces/caseStudyRepository.interface"

            // ADD these imports
            import { prisma } from '@/lib/prisma';
            import { unstable_cache } from 'next/cache';
            import { CACHE_TAGS } from '@/lib/utils/cache';
            ```
        3.  **Rewrite `getCaseStudies` Method:**
            *   **Before:**
                ```typescript
                getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
                  return this.caseStudyRepository.getCaseStudies(locale);
                }
                ```
            *   **After (with Prisma and Caching):**
                ```typescript
                getCaseStudies = async (locale: Locale): Promise<CaseStudy[]> => {
                  const getCachedCaseStudies = unstable_cache(
                    async (locale: Locale) => {
                      const model = locale === 'pl' ? prisma.caseStudyPL : prisma.caseStudyEN;
                      return model.findMany({
                        orderBy: { order_index: 'asc' },
                      });
                    },
                    [`case-studies-${locale}`], // Unique cache key
                    {
                      tags: [CACHE_TAGS.CASE_STUDIES, `case-studies:${locale}`], // Tags for revalidation
                    }
                  );
                  // The result from Prisma will match the domain model now, so no mapping is needed.
                  return getCachedCaseStudies(locale);
                }
                ```
        4.  **Rewrite `createCaseStudy`, `updateCaseStudy`, `deleteCaseStudy` Methods:**
            *   These methods will now directly use `prisma.caseStudyEN.create(...)`, `prisma.caseStudyEN.update(...)`, etc. They do **not** get wrapped in `unstable_cache`.

*   `[ ]` **Task 3.2: Refactor API Routes with Cache Revalidation.**
    *   **Action:** For each API route file in `src/app/api/` that handles data mutations, you will add a `revalidateTag` call.

    *   **Example: Refactoring `src/app/api/admin/case-studies/route.ts`**

        1.  **Open:** `src/app/api/admin/case-studies/route.ts`
        2.  **Modify Imports:**
            ```typescript
            // ADD this import if it's not there
            import { revalidateTag } from 'next/cache';
            ```
        3.  **Update `POST` handler:**
            *   **After** the `await caseStudyService.createCaseStudy(...)` call, add the revalidation logic.
            ```typescript
            // ... inside POST handler
            const newCaseStudy = await caseStudyService.createCaseStudy(data, locale);

            // Invalidate the cache for case studies
            revalidateTag(CACHE_TAGS.CASE_STUDIES);

            return NextResponse.json(newCaseStudy);
            //...
            ```
        4.  **Update `PUT` and `DELETE` handlers:** Apply the same `revalidateTag(CACHE_TAGS.CASE_STUDIES)` logic after successful database operations in the `PUT` and `DELETE` functions in this file and all other API route files.

*   `[ ]` **Task 3.3: Refactor and Verify Server Actions.**
    *   **Action:** Review `src/infrastructure/services/pageServerActions.ts`.
    *   **Verification:** Ensure that `updateHeroSectionAction` and `getHeroSectionAction` correctly call the refactored `heroService`. The `getHeroSectionAction` should now benefit from the `unstable_cache` implemented inside the service.
    *   **Action:** For `updateHeroSectionAction`, add the cache revalidation call.
        ```typescript
        // src/infrastructure/services/pageServerActions.ts
        import { revalidateTag } from 'next/cache';
        import { CACHE_TAGS } from '@/lib/utils/cache'; // Assuming you create a HERO tag

        export async function updateHeroSectionAction(data: Partial<HeroModel>, locale: string) {
          const result = await heroService.updateHeroSection(data, locale);
          revalidateTag(CACHE_TAGS.HERO); // Add a 'hero' tag to CACHE_TAGS
          return result;
        }
        ```

---

### **Verification: Public Components Data Fetching Strategy**

I have verified the data fetching patterns in your public-facing components. The existing architecture correctly separates concerns, and this refactoring will build upon that good foundation.

1.  **Server Components (e.g., `src/app/[locale]/page.tsx`, `.../[slug]/page.tsx`)**:
    *   **Current State:** These components correctly fetch data by directly calling the service layer (e.g., `await caseStudyService.getCaseStudyBySlug(...)`).
    *   **After Refactor:** This pattern remains correct. The only change is that these calls will now be transparently cached by `unstable_cache` within the service, leading to faster page loads on subsequent visits.

2.  **Client Components (e.g., `src/app/(admin)/**`, `*.client.tsx`)**:
    *   **Current State:** Client components do **not** import or call server-side services directly. They correctly use hooks like `useAdminCaseStudies` which internally use the `fetch` API to call Next.js API routes (`/api/admin/...`).
    *   **After Refactor:** This pattern remains correct and is the recommended approach. The client-side application will trigger API routes, which then execute the refactored, Prisma-based service logic on the server. The `revalidateTag` calls within those API routes will ensure that after a mutation, any cached data on the server is busted, and subsequent fetches (including from Server Components) will receive the fresh data.

**Conclusion:** The project already follows the best practice of separating data fetching logic for server and client components. This refactoring will enhance this pattern by replacing the repository layer with a more direct and efficient Prisma implementation, backed by a robust server-side caching and revalidation strategy.