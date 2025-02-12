declare module 'next/cache' {
  /**
   * Revalidates a given tag.
   * @param tag - The cache tag to revalidate.
   * @returns A promise that resolves when the tag has been revalidated.
   */
  export function revalidateTag(tag: string): Promise<void>;

    /**
   * Caches an asynchronous function for subsequent calls.
   * @param fn - The asynchronous function to cache.
   * @param key - A unique key array for the cache entry.
   * @param options - Options for caching, including revalidation time and tags.
   * @returns The same function with caching enabled.
   */
    export function unstable_cache<T extends (...args: any[]) => any>(
      fn: T,
      key: any[],
      options?: { revalidate?: number; tags?: string[] }
    ): T;
}