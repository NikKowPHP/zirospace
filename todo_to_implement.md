# TODO: Fix GlobalProgressBar Build Errors

## Problem Description

The current implementation of `src/components/layout/global-progress-bar.tsx` is causing build failures due to incompatibilities with the Next.js App Router. The specific errors indicate:
1.  The component uses `useState` and `useEffect` (Client Component hooks) but is not marked with `"use client"`.
2.  The component imports `useRouter` from `next/router` (intended for the Pages Router) instead of the appropriate navigation hooks from `next/navigation` (for the App Router).
3.  The router event handling (`router.events.on`) is specific to the Pages Router and will not work as expected in the App Router.

## Tasks to Resolve Issues

### 1. Convert `GlobalProgressBar` to a Client Component
    - **Action:** Add the `"use client";` directive at the very top of the file `src/components/layout/global-progress-bar.tsx`.
    - **Reasoning:** This will allow the use of `useState` and `useEffect` hooks within the component.
    - **File to Modify:** `src/components/layout/global-progress-bar.tsx`

### 2. Update Router Import and Usage for App Router
    - **Action 2.1:** Change the import statement for router hooks.
        - **Replace:** `import { useRouter } from 'next/router';`
        - **With:** `import { usePathname } from 'next/navigation';`
    - **Action 2.2:** Adapt the `useEffect` logic to use `usePathname` for detecting route changes. The Pages Router's `router.events` are not available in the App Router. A common pattern is to track changes in the `pathname`.
        - Declare `const pathname = usePathname();`
        - You might need to store the `previousPathname` in a state or ref to compare and trigger the progress bar on change.
        - **Example `useEffect` structure (conceptual):**
          ```javascript
          // Inside GlobalProgressBar component
          const pathname = usePathname();
          const [isLoading, setIsLoading] = useState(false);
          const [progress, setProgress] = useState(0);
          // Optional: to only trigger on actual path changes, not initial render
          const [internalPathname, setInternalPathname] = useState(pathname);

          useEffect(() => {
            if (internalPathname !== pathname) { // If path has changed
              setIsLoading(true);
              setProgress(30); // Start progress
              setInternalPathname(pathname); // Update internal tracker

              // Simulate progress (this is a simplification for a visual bar)
              let currentProg = 30;
              const progInterval = setInterval(() => {
                currentProg += Math.random() * 10;
                if (currentProg >= 90) {
                  clearInterval(progInterval);
                  setProgress(95); // Almost complete
                  // Simulate completion
                  setTimeout(() => {
                    setProgress(100);
                    setTimeout(() => {
                      setIsLoading(false);
                      setProgress(0);
                    }, 300); // Short delay before hiding
                  }, 200);
                } else {
                  setProgress(currentProg);
                }
              }, 100);

              return () => {
                clearInterval(progInterval);
              };
            }
          }, [pathname, internalPathname]);
          ```
        - **Note:** The progress simulation (intervals, timeouts) will likely need fine-tuning for good user experience. The App Router doesn't provide direct client-side "routeChangeComplete" events in the same way Pages Router did, so this part is often a UX simulation.
    - **File to Modify:** `src/components/layout/global-progress-bar.tsx`

### 3. Testing and Verification
    - **Action 3.1:** After applying the fixes, run `npm run dev` (or your dev script) to ensure the application starts without build errors.
    - **Action 3.2:** Navigate between different pages in your application.
        - Verify the progress bar appears at the top during navigation.
        - Verify the progress bar animates and completes.
        - Verify the progress bar hides after navigation is complete.
    - **Action 3.3:** Check the browser console for any new errors or warnings related to the `GlobalProgressBar`.
    - **Action 3.4:** Run `npm run build` to confirm the build completes successfully.

## Completion Criteria
- [x] `GlobalProgressBar` is marked as a Client Component.
- [x] `GlobalProgressBar` uses `usePathname` (or other appropriate `next/navigation` hooks) instead of `next/router`.
- [ ] The progress bar shows and animates correctly during page navigations in the App Router.
- [ ] The application builds successfully without errors related to this component.