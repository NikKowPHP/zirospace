/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const blogPostsEn = [
    {
      slug: 'first-post',
      title: 'First Blog Post',
      image_url: '/images/case-studies/gsense/gsense.avif',
      image_alt: 'First Blog Post',
      excerpt: '<p><em>Excerpt:</em> This is a comprehensive introduction to our first blog post, covering a range of topics and designed to engage readers from start to finish.</p>',
      content_html: `
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
      is_pinned: true,
    },
    {
      slug: 'second-post',
      title: 'Second Blog Post: Deep Dive into Next.js',
      image_url: '/images/case-studies/gsense/gsense.avif',
      image_alt: 'Second Blog Post',
      excerpt: '<p><em>Excerpt:</em> A detailed exploration of Next.js features and best practices for building modern web applications.</p>',
      content_html: '<p>In this post, we delve into the advanced features of Next.js, including server-side rendering, static site generation, and API routes. We will also cover performance optimization techniques and deployment strategies.</p><img src="/images/case-studies/gsense/gsense.avif" alt="Next.js" /><p>Learn how to leverage Next.js to create fast, scalable, and SEO-friendly web applications.</p>',
      is_pinned: false,
    },
    {
      slug: 'third-post',
      title: 'Third Blog Post: The Future of Web Development',
      image_url: '/images/case-studies/gsense/gsense.avif',
      image_alt: 'Third Blog Post',
      excerpt: '<p><em>Excerpt:</em> An overview of the emerging trends and technologies that are shaping the future of web development.</p>',
      content_html: '<p>This post explores the latest trends in web development, such as WebAssembly, serverless computing, and progressive web apps. We will discuss how these technologies are transforming the way we build and deploy web applications.</p><img src="/images/case-studies/gsense/gsense.avif" alt="Web Development Trends" /><p>Stay ahead of the curve by understanding the technologies that will define the future of the web.</p>',
      is_pinned: false,
    },
  ];

  const blogPostsPl = [
    {
      slug: 'pierwszy-post',
      title: 'Pierwszy Post na Blogu',
      image_url: '/images/case-studies/gsense/gsense.avif',
      image_alt: 'Pierwszy Post na Blogu',
      excerpt: '<p><em>Fragment:</em> To kompleksowe wprowadzenie do naszego pierwszego postu na blogu, obejmujące szeroki zakres tematów i mające na celu zaangażowanie czytelników od początku do końca.</p>',
      content_html: `
        <h1>Wprowadzenie</h1>
        <p>Witamy w naszym pierwszym poście na blogu! W tym artykule zbadamy różne aspekty nowoczesnego tworzenia stron internetowych i podzielimy się spostrzeżeniami na temat tego, jak budować lepsze aplikacje internetowe.</p>

        <h2>Sekcja 1: Zrozumienie Podstaw</h2>
        <p>Zanim przejdziemy do zaawansowanych tematów, omówmy kilka podstawowych koncepcji. Tworzenie stron internetowych obejmuje kombinację HTML, CSS i JavaScript.</p>

        <h3>HTML</h3>
        <p>HTML (HyperText Markup Language) to podstawa każdej strony internetowej. Zapewnia strukturę i treść.</p>

        <h3>CSS</h3>
        <p>CSS (Cascading Style Sheets) służy do stylizowania elementów HTML, kontrolując wygląd wizualny strony.</p>

        <h3>JavaScript</h3>
        <p>JavaScript dodaje interaktywność i dynamiczne zachowanie do stron internetowych.</p>

        <h2>Sekcja 2: Zaawansowane Techniki</h2>
        <p>Teraz, gdy mamy podstawowe zrozumienie, zbadajmy kilka zaawansowanych technik.</p>

        <ul>
          <li><strong>Renderowanie po stronie serwera (SSR):</strong> Poprawia wydajność i SEO.</li>
          <li><strong>Generowanie statycznych stron (SSG):</strong> Generuje statyczne pliki HTML w czasie budowania.</li>
          <li><strong>Trasy API:</strong> Twórz funkcje bezserwerowe do obsługi żądań API.</li>
        </ul>

        <blockquote>
          "Tworzenie stron internetowych stale się rozwija, dlatego ważne jest, aby być na bieżąco z najnowszymi trendami i technologiami." - John Doe, Ekspert ds. Tworzenia Stron Internetowych
        </blockquote>

        <img src="/images/case-studies/gsense/gsense.avif" alt="Tworzenie Stron Internetowych" />

        <h2>Sekcja 3: Najlepsze Praktyki</h2>
        <p>Aby zapewnić, że Twoje aplikacje internetowe są solidne i łatwe w utrzymaniu, postępuj zgodnie z tymi najlepszymi praktykami:</p>

        <ol>
          <li>Pisz czysty i dobrze udokumentowany kod.</li>
          <li>Optymalizuj wydajność, minimalizując żądania HTTP.</li>
          <li>Używaj systemu kontroli wersji, takiego jak Git.</li>
        </ol>

        <h2>Wniosek</h2>
        <p>Dziękujemy za przeczytanie naszego pierwszego postu na blogu! Mamy nadzieję, że był on pouczający i pomocny. Bądźcie czujni na kolejne artykuły o tworzeniu stron internetowych.</p>
      `,
      is_pinned: false,
    },
    {
      slug: 'drugi-post',
      title: 'Drugi Post na Blogu: Dogłębne Zanurzenie w Next.js',
      image_url: '/images/case-studies/gsense/gsense.avif',
      image_alt: 'Drugi Post na Blogu',
      excerpt: '<p><em>Fragment:</em> Szczegółowa eksploracja funkcji Next.js i najlepszych praktyk dotyczących budowania nowoczesnych aplikacji internetowych.</p>',
      content_html: '<p>W tym poście zagłębiamy się w zaawansowane funkcje Next.js, w tym renderowanie po stronie serwera, generowanie statycznych stron i trasy API. Omówimy również techniki optymalizacji wydajności i strategie wdrażania.</p><img src="/images/case-studies/gsense/gsense.avif" alt="Next.js" /><p>Dowiedz się, jak wykorzystać Next.js do tworzenia szybkich, skalowalnych i przyjaznych dla SEO aplikacji internetowych.</p>',
      is_pinned: false,
    },
    {
      slug: 'trzeci-post',
      title: 'Trzeci Post na Blogu: Przyszłość Tworzenia Stron Internetowych',
      image_url: '/images/case-studies/gsense/gsense.avif',
      image_alt: 'Trzeci Post na Blogu',
      excerpt: '<p><em>Fragment:</em> Przegląd pojawiających się trendów i technologii, które kształtują przyszłość tworzenia stron internetowych.</p>',
      content_html: '<p>Ten post bada najnowsze trendy w tworzeniu stron internetowych, takie jak WebAssembly, przetwarzanie bezserwerowe i progresywne aplikacje internetowe. Omówimy, w jaki sposób te technologie zmieniają sposób, w jaki budujemy i wdrażamy aplikacje internetowe.</p><img src="/images/case-studies/gsense/gsense.avif" alt="Trendy w Tworzeniu Stron Internetowych" /><p>Wyprzedź konkurencję, rozumiejąc technologie, które zdefiniują przyszłość sieci.</p>',
      is_pinned: false,
    },
  ];

  await knex('blog_posts_en').insert(blogPostsEn);
  await knex('blog_posts_pl').insert(blogPostsPl);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex('blog_posts_en').del();
  await knex('blog_posts_pl').del();
};