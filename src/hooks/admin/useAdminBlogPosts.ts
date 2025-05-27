import { useState, useCallback } from 'react';
import { BlogPost } from '@/domain/models/blog-post.model';
import { Locale } from '@/i18n';
import useAdminApi from './useAdminApi';

interface UseAdminBlogPostsProps {
  initialBlogPosts?: Record<Locale, BlogPost[]>;
}

const useAdminBlogPosts = ({ initialBlogPosts }: UseAdminBlogPostsProps = {}) => {
  const [blogPosts, setBlogPosts] = useState<Record<Locale, BlogPost[]>>(
    initialBlogPosts || { en: [], pl: [] }
  );
  const { loading, error, callApi, clearError } = useAdminApi();

  const getBlogPosts = useCallback(async (locale: Locale) => {
    try {
      const data: BlogPost[] = await callApi(
        `/api/admin/blog-posts?locale=${locale}`,
        { method: 'GET' },
        {
          loadingMessage: 'Fetching blog posts...',
          errorMessage: 'Failed to fetch blog posts',
        }
      );
      setBlogPosts((prev) => ({ ...prev, [locale]: data }));
    } catch (error) {
      // Error is already handled by useAdminApi
    }
  }, [callApi]);

  const getBlogPost = useCallback(async (id: string, locale: Locale): Promise<BlogPost | null> => {
    try {
      const data: BlogPost = await callApi(
        `/api/admin/blog-posts/${id}?locale=${locale}`,
        { method: 'GET' },
        {
          loadingMessage: 'Fetching blog post...',
          errorMessage: 'Failed to fetch blog post',
        }
      );
      return data;
    } catch (error) {
      // Error is already handled by useAdminApi
      return null;
    }
  }, [callApi]);

  const createBlogPost = useCallback(
    async (data: Partial<BlogPost>, locale: Locale) => {
      try {
        const newBlogPost: BlogPost = await callApi(
          `/api/admin/blog-posts`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Creating blog post...',
            successMessage: 'Blog post created successfully!',
            errorMessage: 'Failed to create blog post',
          }
        );
        setBlogPosts((prev) => ({
          ...prev,
          [locale]: [...(prev[locale] || []), newBlogPost],
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateBlogPost = useCallback(
    async (id: string, data: Partial<BlogPost>, locale: Locale) => {
      try {
        const updatedBlogPost: BlogPost = await callApi(
          `/api/admin/blog-posts/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Updating blog post...',
            successMessage: 'Blog post updated successfully!',
            errorMessage: 'Failed to update blog post',
          }
        );
        setBlogPosts((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).map((bp: BlogPost) =>
            bp.id === id ? updatedBlogPost : bp
          ),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const deleteBlogPost = useCallback(
    async (id: string, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/blog-posts/${id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale }),
          },
          {
            loadingMessage: 'Deleting blog post...',
            successMessage: 'Blog post deleted successfully!',
            errorMessage: 'Failed to delete blog post',
          }
        );
        setBlogPosts((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).filter((bp) => bp.id !== id),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const pinBlogPost = useCallback(
    async (id: string, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/blog-posts/${id}/pin`, // Assuming there's a pin endpoint
          {
            method: 'POST', // Or PUT, depending on your API
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale }),
          },
          {
            loadingMessage: 'Pinning blog post...',
            successMessage: 'Blog post pinned successfully!',
            errorMessage: 'Failed to pin blog post',
          }
        );
        // Optimistically update the isPinned status in the local state
        setBlogPosts((prev) => {
          const updatedBlogPosts = { ...prev };
          if (updatedBlogPosts[locale]) {
            updatedBlogPosts[locale] = updatedBlogPosts[locale].map((bp) =>
              bp.id === id ? { ...bp, isPinned: true } : bp
            );
          }
          return updatedBlogPosts;
        });
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  return {
    blogPosts,
    loading,
    error,
    getBlogPosts,
    getBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    pinBlogPost,
    clearError,
  };
};

export default useAdminBlogPosts;