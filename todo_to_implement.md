# Plan: Implement Robust Loading Animations for ZIRO Project

## I. Page Transition Loading Indicators
- [x] **B1.1 & B1.2: Implement Route-Specific Loading UI with Reusable Component**
    - [x] Design and create a reusable, visually consistent loading component (e.g., spinner, basic skeleton).
        - Target file: `src/components/ui/loader/page-loader.tsx` (or similar)
    - [x] Implement `loading.tsx` for key route segments using the reusable loader:
        - [x] `src/app/[locale]/loading.tsx`
        - [x] `src/app/[locale]/services/loading.tsx`
        - [x] `src/app/[locale]/services/[slug]/loading.tsx`
        - [x] `src/app/[locale]/case-studies/loading.tsx`
        - [x] `src/app/[locale]/case-studies/[slug]/loading.tsx`
        - [x] `src/app/[locale]/blog/loading.tsx`
        - [x] `src/app/[locale]/blog/[slug]/loading.tsx`
        - [ ] *(Add for other critical routes as identified)*
    - *Effort: Medium*
    - *Challenge: Ensuring visual consistency and minimal performance impact.*
    - *Testing: Verify loader appears on route change and hides on completion; check behavior on fast/slow networks.*

- [x] **B1.3 (Optional): Implement Global Top Progress Bar (NProgress-like)**
    - [x] Choose or create a lightweight progress bar library/component.
        - Target file (new): `src/components/layout/global-progress-bar.tsx`
    - [x] Integrate with Next.js router events in `src/app/[locale]/layout.tsx` or `src/app/[locale]/client-wrapper.tsx` to show/hide on navigation.
    - *Effort: Small to Medium*
    - *Challenge: Smooth integration without layout shifts; handling navigation errors.*

- [x] **B1.4 (Optional - Advanced): Implement Page Transition Animations with Framer Motion**
    - [x] Wrap page content in `src/app/[locale]/layout.tsx` or `src/app/[locale]/client-wrapper.tsx` with `<AnimatePresence>` and `motion.div`.
        - Target file: `src/app/[locale]/client-wrapper.tsx`
    - [x] Define `initial`, `animate`, and `exit` props for desired transition effects (fade, slide).
    - [x] Ensure proper `key` management for `AnimatePresence` (e.g., using `pathname`).
    - *Effort: Medium to Large*
    - *Challenge: Achieving smooth, non-jarring animations; performance considerations.*

## II. Data Loading Indicators within Pages/Components
- [x] **B2.1: Utilize Next.js Suspense for Server Components Fetching Data**
    - [x] Identify Server Components that perform data fetching (e.g., `src/app/[locale]/blog/page.tsx` if it fetches posts directly).
    - [x] Wrap these data-dependent Server Components in `<Suspense fallback={<YourSkeletonOrSpinner />}>` in their parent components.
    - [x] Create appropriate skeleton/spinner fallbacks for these Suspense boundaries.
    - *Effort: Medium*
    - *Challenge: Correctly identifying Suspense boundaries; designing effective fallbacks.*

- [x] **B2.2 & B2.3: Implement Loading States for Client-Side Data Fetching & Skeletons**
    - [x] **Design and Create Reusable Skeleton Components:**
        - [x] `src/components/ui/skeletons/card-skeleton.tsx`
        - [x] `src/components/ui/skeletons/list-item-skeleton.tsx`
        - [ ] *(Add others as UI patterns are identified, e.g., form skeleton, table skeleton)*
    - [x] **Implement in Client Components:**
        - [x] For components fetching data directly (if any, not relying on context/Suspense):
            - Add `isLoading` state.
            - Show skeletons/spinners based on `isLoading`.
        - [x] For components using `AdminContext` or `PageContext`:
            - Utilize the `loading` state from these contexts.
            - Affected files: `src/app/(admin)/admin/sections/**/*.tsx`, and other components consuming these contexts.
    - *Effort: Medium to Large*
    - *Challenge: Creating versatile and accurate skeleton components; managing multiple loading states if not using Suspense effectively; avoiding flash of loading state.*
    - *Testing: Verify loaders for data fetching sections; check error and empty states are handled distinctly from loading states.*

## III. Suggested Order of Execution

1.  **Reusable Basic Loading Component:** Implement `src/components/ui/loader/page-loader.tsx` (B1.2 first part).
2.  **Route-Level Loading (`loading.tsx`):** Implement for major routes (B1.1 & B1.2 second part).
3.  **Data Loading with Suspense (Server Components):** Focus on B2.1.
4.  **Data Loading for Client Components (Contexts & Skeletons):** Focus on B2.2 & B2.3, creating initial skeleton components.
5.  **(Optional) Global Progress Bar:** Implement B1.3 if desired.
6.  **Refine Skeleton Loaders:** Improve and expand skeleton components (B2.3 refinement).
7.  **(Optional) Advanced Page Transitions (Framer Motion):** Implement B1.4 as a polish step.

## IV. General Considerations
- [x] **Performance:** Ensure all loading indicators are lightweight and do not negatively impact perceived or actual performance.
- [x] **Accessibility:** Ensure all loading states are communicated appropriately to assistive technologies (e.g., using ARIA attributes if necessary).
- [x] **Consistency:** Maintain a consistent visual style for all loading indicators across the application.
- [x] **Error Handling:** Ensure that loading states are correctly dismissed and error messages are shown if data fetching or navigation fails.