
import { useState, useCallback } from 'react';
import { Advisor } from '@/domain/models/models';
import { Locale } from '@/i18n';
import useAdminApi from './useAdminApi';

const useAdminAdvisors = () => {
  const [advisors, setAdvisors] = useState<Record<Locale, Advisor[]>>({ en: [], pl: [] });
  const { loading, error, callApi, clearError } = useAdminApi();

  const getAdvisors = useCallback(async (locale: Locale) => {
    try {
      const data: Advisor[] = await callApi(
        `/api/admin/advisors?locale=${locale}`,
        { method: 'GET' },
        {
          loadingMessage: 'Fetching advisors...',
          errorMessage: 'Failed to fetch advisors',
        }
      );
      setAdvisors((prev) => ({ ...prev, [locale]: data }));
    } catch (error) {
      // Error is already handled by useAdminApi
    }
  }, [callApi]);

  const createAdvisor = useCallback(
    async (data: Partial<Advisor>, locale: Locale) => {
      try {
        const newAdvisor: Advisor = await callApi(
          `/api/admin/advisors`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Creating advisor...',
            successMessage: 'Advisor created successfully!',
            errorMessage: 'Failed to create advisor',
          }
        );
        setAdvisors((prev) => ({
          ...prev,
          [locale]: [...(prev[locale] || []), newAdvisor],
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateAdvisor = useCallback(
    async (id: string, data: Partial<Advisor>, locale: Locale) => {
      try {
        const updatedAdvisor: Advisor = await callApi(
          `/api/admin/advisors/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Updating advisor...',
            successMessage: 'Advisor updated successfully!',
            errorMessage: 'Failed to update advisor',
          }
        );
        setAdvisors((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).map((advisor) =>
            advisor.id === id ? updatedAdvisor : advisor
          ),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const deleteAdvisor = useCallback(
    async (id: string, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/advisors/${id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale }),
          },
          {
            loadingMessage: 'Deleting advisor...',
            successMessage: 'Advisor deleted successfully!',
            errorMessage: 'Failed to delete advisor',
          }
        );
        setAdvisors((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).filter((advisor) => advisor.id !== id),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateAdvisorOrder = useCallback(
    async (orders: { id: string; order: number }[], locale: Locale) => {
      try {
        await callApi(
          `/api/admin/advisors-order`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orders, locale }),
          },
          {
            loadingMessage: 'Updating advisor order...',
            successMessage: 'Order updated successfully!',
            errorMessage: 'Failed to update order',
          }
        );
        // Optimistically update the order in the local state
        setAdvisors((prev) => {
          const updatedAdvisors = { ...prev };
          if (updatedAdvisors[locale]) {
            updatedAdvisors[locale] = updatedAdvisors[locale].map((t) => {
              const orderUpdate = orders.find((o) => o.id === t.id);
              if (orderUpdate) {
                return { ...t, order_index: orderUpdate.order };
              }
              return t;
            }).sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
          }
          return updatedAdvisors;
        });
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  return {
    advisors,
    loading,
    error,
    getAdvisors,
    createAdvisor,
    updateAdvisor,
    deleteAdvisor,
    updateAdvisorOrder,
    clearError,
  };
};

export default useAdminAdvisors;