You are absolutely right. My apologies. I missed that crucial detail in my initial analysis. The use of Server Actions within Client Components (`'use client'`) is indeed an anti-pattern that breaks the intended client-server boundary. Client components should fetch data via API routes.

Thank you for the correction. I will now perform a targeted analysis to identify these issues and create a precise refactoring plan.

### Analysis of the Architectural Inconsistency

The core issue is that components marked with `'use client'` are directly importing and calling functions marked with `'use server'`.

1.  **`FloatVideo.tsx` & `FooterVideo.tsx`:**
    *   **File:** `src/components/sections/float-video/float-video.tsx` and `footer-video.tsx`
    *   **Problem:** These client components directly import and call `getYoutubeAction` from `youtubeServerActions.ts`.
    *   **Correct Pattern:** These components should use the `fetch` API inside a `useEffect` hook to call a dedicated API route.

2.  **`pageServerActions.ts`:**
    *   **File:** `src/infrastructure/services/pageServerActions.ts`
    *   **Analysis:** This file defines `getHeroSectionAction`. It is used in `src/components/sections/hero/hero.tsx`. Since `HeroSection` is a **Server Component** (it's an `async` function without the `'use client'` directive), this is a **correct and intended use of Server Actions**. This component does not need refactoring.

Based on this, the refactoring effort must focus on replacing `youtubeServerActions.ts` with a proper API route and updating the client components that consume it.

Here is the new, detailed `master_plan.md` to correct this.

---

### New `master_plan.md`

# Refactoring Plan: Client Component Data Fetching

This plan corrects the architectural issue of Client Components calling Server Actions directly. The goal is to replace this pattern with standard API route communication, ensuring a clear separation of client and server logic.

### Phase 1: Create the API Endpoint for YouTube Data

The first step is to create a dedicated, cacheable API route that client components can fetch from.

-   [ ] **Task 1.1: Create a new API route for YouTube data.**
    *   **Reasoning:** To provide a proper RESTful endpoint for client-side components to fetch the YouTube URL, replacing the direct server action call.
    *   **Action:** Create the file `src/app/api/youtube/route.ts`.
    *   **Implementation:** The file should contain a `GET` handler that uses the existing `youtubeService` to fetch the data. It should also handle cases where no data is found.

        ```typescript
        // File: src/app/api/youtube/route.ts
        import { NextResponse } from 'next/server';
        import { youtubeService } from '@/lib/services/youtube.service';
        import logger from '@/lib/logger';

        export async function GET() {
          try {
            logger.log('Fetching YouTube data via API route');
            const youtubeData = await youtubeService.getYoutube();
            
            if (!youtubeData) {
              return NextResponse.json({ error: 'YouTube data not found' }, { status: 404 });
            }

            return NextResponse.json(youtubeData);
          } catch (error) {
            logger.error(`Error fetching YouTube data: ${error}`);
            return NextResponse.json({ error: 'Failed to fetch YouTube data' }, { status: 500 });
          }
        }
        ```

### Phase 2: Refactor Client Components to Use the New API Route

With the endpoint in place, we will update the client components to use `fetch` instead of the server action.

-   [ ] **Task 2.1: Refactor `FloatVideo.tsx` to fetch from the API.**
    *   **Reasoning:** To decouple the client component from server-side logic.
    *   **Action:** In `src/components/sections/float-video/float-video.tsx`, remove the import for `getYoutubeAction` and modify the `useEffect` hook.

        *   **Remove:**
            ```typescript
            import { getYoutubeAction } from '@/app/(admin)/admin/sections/youtube/actions/youtubeServerActions'
            ```
        *   **Modify the `useEffect` hook:**
            ```typescript
            // Inside the FloatVideo component
            useEffect(() => {
              const fetchYoutubeUrl = async () => {
                try {
                  const response = await fetch('/api/youtube');
                  if (!response.ok) {
                    throw new Error('Failed to fetch YouTube URL');
                  }
                  const youtubeData = await response.json();
                  setVideoId(youtubeData?.youtube_url || '');
                } catch (error) {
                  logger.error("Failed to fetch YouTube URL:", error);
                }
              };
              fetchYoutubeUrl();
            }, []);
            ```

-   [ ] **Task 2.2: Refactor `FooterVideo.tsx` to fetch from the API.**
    *   **Reasoning:** This component has the same issue as `FloatVideo.tsx` and must be updated for consistency.
    *   **Action:** Apply the exact same changes as in Task 2.1 to the file `src/components/sections/float-video/footer-video.tsx`.

### Phase 3: Cleanup and Deprecation

The final step is to remove the now-obsolete server action file.

-   [ ] **Task 3.1: Delete the obsolete `youtubeServerActions.ts` file.**
    *   **Reasoning:** This file has been fully replaced by the new API route and is no longer needed.
    *   **Action:** Delete the file.
    *   **Command:**
        ```bash
        rm src/app/(admin)/admin/sections/youtube/actions/youtubeServerActions.ts
        ```

-   [ ] **Task 3.2: Clean up dead code in `pageServerActions.ts`**
    *   **Reasoning:** The function `updateHeroSectionAction` is not used anywhere in the codebase and should be removed to prevent confusion.
    *   **Action:** In `src/infrastructure/services/pageServerActions.ts`, delete the `updateHeroSectionAction` function and its related imports. The `getHeroSectionAction` function should remain as it is used correctly by a Server Component.

---

I will now update the `master_plan.md` file in the project with this new, corrected plan.