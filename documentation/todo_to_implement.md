TODO: Fix "updates_undefined" table error in Admin Updates section
Project: ZIRO
Estimated Total Time: 0.5 hours for 4b model
Files Affected: 1 file

Implementation Plan

Phase 1: Stricter Locale Validation in API Route
File: `./src/app/api/admin/updates/route.ts`
- [ ] **Modify GET request handler for robust locale validation**
    - **Location**: Inside the `GET` function in `./src/app/api/admin/updates/route.ts`, around line 24.
    - **Current Code Snippet (approximate context):**
      ```typescript
      export async function GET(request: NextRequest) {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale');

        if (!locale) { // Current check
          return NextResponse.json({ error: 'Locale is required' }, { status: 400 });
        }
        // ...
      }
      ```
    - **Action**: Replace the existing `if (!locale)` check with a more comprehensive validation to ensure `locale` is strictly "en" or "pl".
    - **New Code Snippet:**
      ```typescript
      export async function GET(request: NextRequest) {
        const { searchParams } = new URL(request.url);
        const locale = searchParams.get('locale');

        if (!locale || (locale !== 'en' && locale !== 'pl')) { // Enhanced validation
          return NextResponse.json({ error: 'Locale is required and must be "en" or "pl"' }, { status: 400 });
        }
        // ... rest of the function
      }
      ```
    - **Expected Outcome**: The API endpoint `/api/admin/updates` will now only proceed if the `locale` query parameter is explicitly "en" or "pl". Any other value (including missing, empty, or "undefined" string) will result in a 400 error. This prevents `UpdateRepositoryLocal` from being initialized with an invalid locale string that could lead to table name `updates_undefined`.
    - **Verification**:
        1. After applying the change, try accessing `/api/admin/updates` (no locale) -> Should see 400 error.
        2. Try `/api/admin/updates?locale=de` -> Should see 400 error.
        3. Try `/api/admin/updates?locale=undefined` -> Should see 400 error.
        4. Try `/api/admin/updates?locale=en` -> Should proceed (may still error if `updates_en` table is missing, but not with `updates_undefined`).

Phase 2: Testing Admin Updates Page
File: (Manual testing via browser)
- [ ] **Navigate to the Admin Updates page** at `/admin/sections/updates`.
    - **Action**: Open this page in your browser after the code change.
    - **Expected Outcome**: The page should load without the "SQLITE_ERROR: no such table: updates_undefined" error.
    - **Verification**: The error message related to `updates_undefined` should no longer be present. The page might show "No updates" or a different error if the actual `updates_en` or `updates_pl` tables are missing in `sqlite.db`, which would be a separate (but valid) state.

- [ ] **Test locale switching (EN/PL tabs)** on the Admin Updates page.
    - **Action**: Click the "EN" and "PL" tabs.
    - **Expected Outcome**: Switching locales should attempt to load data for that locale.
    - **Verification**: No `updates_undefined` error. If data exists for `updates_en` and `updates_pl` in the local SQLite database, it should be displayed. If tables are missing, errors like "no such table: updates_en" are acceptable as they point to a data/schema issue, not the `undefined` locale issue.

Validation Checklist
- [ ] The `GET` handler in `./src/app/api/admin/updates/route.ts` now contains the stricter locale validation: `if (!locale || (locale !== 'en' && locale !== 'pl'))`.
- [ ] The application compiles successfully after the change.
- [ ] The Admin Updates page (`/admin/sections/updates`) loads without the specific "updates_undefined" SQLite error.
- [ ] Locale switching on the Admin Updates page functions and attempts to load data for the selected locale, without the "updates_undefined" error.

Ready for Implementation
This todo list is optimized for 4b AI models. Each task is:
✅ Self-contained and specific
✅ Includes clear validation criteria
✅ References exact file locations
✅ Estimated at 10-15 minutes completion time