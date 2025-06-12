- [x] **Task 1: Update Next.js configuration**
  - Modify `next.config.js` to add:
    ```javascript
    async redirects() {
      return [
        // Existing redirects
        {
          source: '/home',
          destination: '/',
          permanent: true,
        },
        // New domain redirects
        {
          source: '/:path*',
          destination: 'https://ziro.health/:path*',
          permanent: true,
          has: [
            {
              type: 'host',
              value: 'ziro.space',
            }
          ]
        }
      ]
    }
    ```
  - Update images.domains array to replace 'ziro.space' with 'ziro.health'

- [ ] **Task 2: Verify and update environment variables**
  - Check `.env*` files for any references to old domain
  - Update if found

- [ ] **Task 3: Update SEO/sitemap configuration**
  - Check `next-sitemap.config.js` if exists
  - Update domain in sitemap configuration

- [ ] **Task 4: Test redirects locally**
  - Run development server
  - Test various URLs with Host header set to ziro.space

- [ ] **Task 5: Deployment preparation**
  - Update any deployment configurations (Vercel, Netlify, etc.)
  - Prepare DNS records for new domain