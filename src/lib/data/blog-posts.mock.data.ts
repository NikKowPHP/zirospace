import { BlogPost } from "@/domain/models/blog-post.model";

export const blogPosts: BlogPost[] = [
    {
      id: 'blog-post-1',
      slug: 'first-post',
      title: 'First Blog Post',
      imageurl: '/images/case-studies/gsense/gsense.avif',
      createdAt: '2024-03-01',
      imageAlt: 'First Blog Post',
      excerpt: '<p><em>Excerpt:</em> This is a comprehensive introduction to our first blog post, covering a range of topics and designed to engage readers from start to finish.</p>',
      contentHtml: `
        <h1>Introduction</h1>
        <p>Welcome to our first blog post! In this article, we'll explore various aspects of modern web development and share insights on how to build better web applications.</p>

        <h2>Section 1: Understanding the Basics</h2>
        <p>Before diving into advanced topics, let's cover some fundamental concepts. Web development involves a combination of HTML, CSS, and JavaScript.</p>

        <h3>HTML</h3>
        <p>HTML (HyperText Markup Language) is the foundation of any web page. It provides the structure and content.</p>

        <h3>CSS</h3>
        <p>CSS (Cascading Style Sheets) is used to style the HTML elements, controlling the visual appearance of the page.</p>

        <h3>JavaScript</h3>
        <p>JavaScript adds interactivity and dynamic behavior to web pages.</p>

        <h2>Section 2: Advanced Techniques</h2>
        <p>Now that we have a basic understanding, let's explore some advanced techniques.</p>

        <ul>
          <li><strong>Server-Side Rendering (SSR):</strong> Improves performance and SEO.</li>
          <li><strong>Static Site Generation (SSG):</strong> Generates static HTML files at build time.</li>
          <li><strong>API Routes:</strong> Create serverless functions to handle API requests.</li>
        </ul>

        <blockquote>
          "Web development is constantly evolving, so it's important to stay up-to-date with the latest trends and technologies." - John Doe, Web Development Expert
        </blockquote>

        <img src="/images/case-studies/gsense/gsense.avif" alt="Web Development" />

        <h2>Section 3: Best Practices</h2>
        <p>To ensure your web applications are robust and maintainable, follow these best practices:</p>

        <ol>
          <li>Write clean and well-documented code.</li>
          <li>Optimize performance by minimizing HTTP requests.</li>
          <li>Use a version control system like Git.</li>
        </ol>

        <h2>Conclusion</h2>
        <p>Thank you for reading our first blog post! We hope you found it informative and helpful. Stay tuned for more articles on web development.</p>
      `,
      isPinned:true
    },
    {
      id: 'blog-post-2',
      slug: 'second-post',
      title: 'Second Blog Post: Deep Dive into Next.js',
      imageurl: '/images/case-studies/gsense/gsense.avif',
      createdAt: '2024-03-05',
      imageAlt: 'Second Blog Post',
      excerpt: '<p><em>Excerpt:</em> A detailed exploration of Next.js features and best practices for building modern web applications.</p>',
      contentHtml: '<p>In this post, we delve into the advanced features of Next.js, including server-side rendering, static site generation, and API routes. We will also cover performance optimization techniques and deployment strategies.</p><img src="/images/case-studies/gsense/gsense.avif" alt="Next.js" /><p>Learn how to leverage Next.js to create fast, scalable, and SEO-friendly web applications.</p>',
      isPinned:false
    },
    {
      id: 'blog-post-3',
      slug: 'third-post',
      title: 'Third Blog Post: The Future of Web Development',
      imageurl: '/images/case-studies/gsense/gsense.avif',
      createdAt: '2024-03-10',
      imageAlt: 'Third Blog Post',
      excerpt: '<p><em>Excerpt:</em> An overview of the emerging trends and technologies that are shaping the future of web development.</p>',
      contentHtml: '<p>This post explores the latest trends in web development, such as WebAssembly, serverless computing, and progressive web apps. We will discuss how these technologies are transforming the way we build and deploy web applications.</p><img src="/images/case-studies/gsense/gsense.avif" alt="Web Development Trends" /><p>Stay ahead of the curve by understanding the technologies that will define the future of the web.</p>',
      isPinned:false
    },
  ]