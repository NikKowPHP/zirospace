import { useState, useCallback } from 'react';
import { Testimonial } from '@/domain/models/testimonial.model';
import { Locale } from '@/i18n';
import useAdminApi from './useAdminApi';

interface UseAdminTestimonialsProps {
  initialTestimonials?: Record<Locale, Testimonial[]>;
}

const useAdminTestimonials = ({ initialTestimonials }: UseAdminTestimonialsProps = {}) => {
  const [testimonials, setTestimonials] = useState<Record<Locale, Testimonial[]>>(
    initialTestimonials || { en: [], pl: [] }
  );
  const { loading, error, callApi, clearError } = useAdminApi();

  const getTestimonials = useCallback(async (locale: Locale) => {
    try {
      const data: Testimonial[] = await callApi(
        `/api/admin/testimonials?locale=${locale}`,
        { method: 'GET' },
        {
          loadingMessage: 'Fetching testimonials...',
          errorMessage: 'Failed to fetch testimonials',
        }
      );
      setTestimonials((prev) => ({ ...prev, [locale]: data }));
    } catch (error) {
      // Error is already handled by useAdminApi
    }
  }, [callApi]);

  const createTestimonial = useCallback(
    async (data: Partial<Testimonial>, locale: Locale) => {
      try {
        const newTestimonial: Testimonial = await callApi(
          `/api/admin/testimonials`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Creating testimonial...',
            successMessage: 'Testimonial created successfully!',
            errorMessage: 'Failed to create testimonial',
          }
        );
        setTestimonials((prev) => ({
          ...prev,
          [locale]: [...(prev[locale] || []), newTestimonial],
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateTestimonial = useCallback(
    async (id: string, data: Partial<Testimonial>, locale: Locale) => {
      try {
        const updatedTestimonial: Testimonial = await callApi(
          `/api/admin/testimonials/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Updating testimonial...',
            successMessage: 'Testimonial updated successfully!',
            errorMessage: 'Failed to update testimonial',
          }
        );
        setTestimonials((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).map((testimonial) =>
            testimonial.id === id ? updatedTestimonial : testimonial
          ),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const deleteTestimonial = useCallback(
    async (id: string, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/testimonials/${id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale }),
          },
          {
            loadingMessage: 'Deleting testimonial...',
            successMessage: 'Testimonial deleted successfully!',
            errorMessage: 'Failed to delete testimonial',
          }
        );
        setTestimonials((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).filter((testimonial) => testimonial.id !== id),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  return {
    testimonials,
    loading,
    error,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    clearError,
  };
};

export default useAdminTestimonials;