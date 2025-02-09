import { JSDOM } from 'jsdom';
import createDOMPurify from 'dompurify';

export function sanitizeHTML(html: string): string {
  const config = {
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'img', 'pre', 'code', 'div', 'span'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'class', 'target'],
    FORBID_TAGS: ['html', 'body', 'head', 'doctype'],
    FORBID_CONTENTS: true,
    USE_PROFILES: { html: true }
  };

  if (typeof window === 'undefined') {
    // Server-side: use JSDOM
    const window = new JSDOM('').window;
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(html, config);
  } else {
    // Client-side: use browser's window
    const DOMPurify = createDOMPurify(window);
    return DOMPurify.sanitize(html, config);
  }
}