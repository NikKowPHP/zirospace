// 'use client';

// import { usePathname, useSearchParams } from 'next/navigation';
// import { useEffect } from 'react';

// const GA_MEASUREMENT_ID = 'G-8BMZYL7TEL'

// export function Analytics() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     if (pathname && window.gtag) {
//       const url = pathname + searchParams.toString()
      
//       window.gtag('config', GA_MEASUREMENT_ID, {
//         page_path: url,
//         page_location: window.location.href,
//         cookie_flags: 'SameSite=None;Secure'
//       });
//     }
//   }, [pathname, searchParams]);

//   return null;
// }

// declare global {
//   interface Window {
//     dataLayer: any[];
//     gtag: (
//       command: 'config' | 'event' | 'js',
//       targetId: string | Date,
//       config?: Record<string, any>
//     ) => void;
//   }
// }
