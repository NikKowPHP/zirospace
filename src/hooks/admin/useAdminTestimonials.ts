import { useState, useCallback } from 'react';
import { Testimonial } from '@/domain/models/models';
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

  const updateTestimonialOrder = useCallback(
    async (orders: { id: string; order: number }[], locale: Locale) => {
      try {
        await callApi(
          `/api/admin/testimonials-order`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orders, locale }),
          },
          {
            loadingMessage: 'Updating testimonial order...',
            successMessage: 'Order updated successfully!',
            errorMessage: 'Failed to update order',
          }
        );
        // Optimistically update the order in the local state
        setTestimonials((prev) => {
          const updatedTestimonials = { ...prev };
          if (updatedTestimonials[locale]) {
            updatedTestimonials[locale] = updatedTestimonials[locale].map((t) => {
              const orderUpdate = orders.find((o) => o.id === t.id);
              if (orderUpdate) {
                return { ...t, order_index: orderUpdate.order };
              }
              return t;
            }).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
          }
          return updatedTestimonials;
        });
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
    updateTestimonialOrder,
    clearError,
  };
};

export default useAdminTestimonials;