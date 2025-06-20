Of course. Here is a detailed plan for refactoring your application to remove Knex, consolidate database logic into services using Prisma, and enhance caching.

### Master Plan: Application Refactoring to Prisma and Service-Oriented Architecture

This plan outlines the steps to migrate the application's data layer from a repository pattern using Knex/Supabase-client to a more direct service-layer implementation using Prisma. This will simplify the architecture, remove legacy dependencies, and improve data fetching performance and consistency.

---

#### **Part 1: Prisma Integration and Schema Setup**

This is the foundational step where we introduce Prisma and define the new data structure.

*   `[x]` **Task 1.1: Install and Initialize Prisma.**
    *   Install Prisma CLI and Client: `npm install prisma --save-dev` and `npm install @prisma/client`.
    *   Initialize the Prisma project: `npx prisma init`. This will create the `prisma/schema.prisma` file.

*   `[ ]` **Task 1.2: Configure Prisma Schema.**
    *   In `prisma/schema.prisma`, set the `datasource db` provider to `postgresql`.
    *   Update the `DATABASE_URL` in your `.env` file with the Supabase connection string.
    *   Translate all existing SQL table definitions into Prisma models. This includes models for `CaseStudy`, `CaseStudySlider`, `Testimonial`, `BlogPost`, `Banner`, `Youtube`, `Service`, `Update`, and `Hero`. I will create separate models for English (`_en`) and Polish (`_pl`) versions as per the current database structure (e.g., `CaseStudyEN`, `CaseStudyPL`).
    *   Ensure all relations, indexes, and constraints (`@id`, `@unique`, `@default`, etc.) are correctly defined.

*   `[ ]` **Task 1.3: Generate Prisma Client.**
    *   Run the command `npx prisma generate` to create the typed Prisma client based on your schema.

*   `[ ]` **Task 1.4: Create Prisma Client Singleton.**
    *   Create a new file `src/lib/prisma.ts` to instantiate and export a single instance of `PrismaClient`. This is crucial for preventing too many database connections in a serverless environment.

---

#### **Part 2: Deprecate and Remove Old Infrastructure**

This part involves cleaning up the project by removing all files and dependencies related to the old data access patterns.

*   `[ ]` **Task 2.1: Remove Knex and SQLite Dependencies.**
    *   Delete the `knexfile.mjs` file.
    *   Delete the entire `migrations` directory.
    *   Delete the entire `seeds` directory.
    *   Delete the `src/lib/data/sql` directory if it only contains the SQLite database.
    *   Uninstall Knex and SQLite packages: `npm uninstall knex sqlite3`.

*   `[ ]` **Task 2.2: Remove Obsolete Repository Layer.**
    *   Delete the entire `src/lib/repositories` directory.
    *   Delete the entire `src/lib/interfaces` directory.
    *   Delete `src/lib/config/database.config.ts`.
    *   Delete the `test_db.mjs` file.
    *   Delete all `*.local.repository.ts` files and their corresponding tests.

*   `[ ]` **Task 2.3: Remove Docker Configuration.**
    *   Delete `docker-compose.proxy.yml`.
    *   Delete `Dockerfile.proxy`.
    *   Delete the `docker` directory.

*   `[ ]` **Task 2.4: Simplify Supabase Client.**
    *   Modify `src/lib/supabase.ts` to only export the client for Supabase Auth. All data-related client exports and functions should be removed.

---

#### **Part 3: Refactor Core Logic to Use Prisma**

This is the main part of the refactoring, where all data logic is rewritten to use Prisma and the caching strategy is implemented.

*   `[ ]` **Task 3.1: Refactor Service Layer.**
    *   Go through each file in `src/lib/services/`.
    *   In each service, import the singleton Prisma Client from `src/lib/prisma.ts`.
    *   Rewrite every data-access method to use Prisma Client queries directly (e.g., replace `repository.getCaseStudies()` with `prisma.caseStudyEN.findMany()`).
    *   Ensure all `GET` methods are wrapped with `unstable_cache` for efficient data caching. Use appropriate tags for each model (e.g., `['services']`, `['services:en']`).

*   `[ ]` **Task 3.2: Refactor API Routes.**
    *   Review all API routes in `src/app/api/`.
    *   Ensure they continue to call the service layer methods.
    *   For all mutation routes (`POST`, `PUT`, `DELETE`), add a call to `revalidateTag()` after a successful database operation to invalidate the relevant cache and ensure data freshness across the application.

*   `[ ]` **Task 3.3: Refactor Server Actions.**
    *   Review all server actions (`*.actions.ts`).
    *   Ensure they correctly call the refactored services.
    *   Add `revalidateTag()` calls to any server actions that perform data mutations.

---

#### **Part 4: Final Cleanup and Verification**

The final step is to ensure the application is clean and all changes have been integrated correctly.

*   `[ ]` **Task 4.1: Update `package.json`.**
    *   Double-check `package.json` to confirm old dependencies are removed and new ones (`prisma`, `@prisma/client`) are present.
*   `[ ]` **Task 4.2: Verify Admin Panel Functionality.**
    *   The admin panel's hooks (`src/hooks/admin/*.ts`) should work without modification, as they call the API routes. A full manual test of all CRUD (Create, Read, Update, Delete) operations in the admin panel is required to confirm the refactoring was successful.
*   `[ ]` **Task 4.3: Clean Up Tests.**
    *   Remove any Jest tests that were specifically for the now-deleted repository layer (`*.repository.test.ts`, `*.local.repository.test.ts`).

By following this plan, we will successfully modernize the data access layer, improve performance with a robust caching strategy, and simplify the overall architecture of the application.