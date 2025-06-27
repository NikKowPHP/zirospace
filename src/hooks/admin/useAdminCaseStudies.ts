import { useState, useCallback } from 'react';
import { CaseStudy } from '@/domain/models/models';
import { Locale } from '@/i18n';
import useAdminApi from './useAdminApi';

interface UseAdminCaseStudiesProps {
  initialCaseStudies?: Record<Locale, CaseStudy[]>;
}

const useAdminCaseStudies = ({ initialCaseStudies }: UseAdminCaseStudiesProps = {}) => {
  const [caseStudies, setCaseStudies] = useState<Record<Locale, CaseStudy[]>>(
    initialCaseStudies || { en: [], pl: [] }
  );
  const { loading, error, callApi, clearError } = useAdminApi();

  const getCaseStudies = useCallback(async (locale: Locale) => {
    try {
      const data: CaseStudy[] = await callApi(
        `/api/admin/case-studies?locale=${locale}`,
        { method: 'GET' },
        {
          loadingMessage: 'Fetching case studies...',
          errorMessage: 'Failed to fetch case studies',
        }
      );
      setCaseStudies((prev) => ({ ...prev, [locale]: data }));
    } catch (error) {
      // Error is already handled by useAdminApi
    }
  }, [callApi]);

  const createCaseStudy = useCallback(
    async (data: Partial<CaseStudy>, locale: Locale) => {
      try {
        const newCaseStudy: CaseStudy = await callApi(
          `/api/admin/case-studies`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Creating case study...',
            successMessage: 'Case study created successfully!',
            errorMessage: 'Failed to create case study',
          }
        );
        setCaseStudies((prev) => ({
          ...prev,
          [locale]: [...(prev[locale] || []), newCaseStudy],
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateCaseStudy = useCallback(
    async (id: string, data: Partial<CaseStudy>, locale: Locale) => {
      try {
        const updatedCaseStudy: CaseStudy = await callApi(
          `/api/admin/case-studies/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Updating case study...',
            successMessage: 'Case study updated successfully!',
            errorMessage: 'Failed to update case study',
          }
        );
        setCaseStudies((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).map((cs) =>
            cs.id === id ? updatedCaseStudy : cs
          ),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const deleteCaseStudy = useCallback(
    async (id: string, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/case-studies/${id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale }),
          },
          {
            loadingMessage: 'Deleting case study...',
            successMessage: 'Case study deleted successfully!',
            errorMessage: 'Failed to delete case study',
          }
        );
        setCaseStudies((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).filter((cs) => cs.id !== id),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateCaseStudyOrder = useCallback(
    async (orders: { id: string; order: number }[], locale: Locale) => {
      try {
        await callApi(
          `/api/admin/case-studies-order`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orders, locale }),
          },
          {
            loadingMessage: 'Updating case study order...',
            successMessage: 'Order updated successfully!',
            errorMessage: 'Failed to update order',
          }
        );
        // Optimistically update the order in the local state
        setCaseStudies((prev) => {
          const updatedCaseStudies = { ...prev };
          if (updatedCaseStudies[locale]) {
            updatedCaseStudies[locale] = updatedCaseStudies[locale].map((cs) => {
              const orderUpdate = orders.find((o) => o.id === cs.id);
              if (orderUpdate) {
                return { ...cs, order: orderUpdate.order };
              }
              return cs;
            });
            // Sort case studies by order
            updatedCaseStudies[locale].sort((a, b) => a.order_index - b.order_index);
          }
          return updatedCaseStudies;
        });
      } catch (error) {
      }
    },
    [callApi]
  );

  return {
    caseStudies,
    loading,
    error,
    getCaseStudies,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    updateCaseStudyOrder,
    clearError,
  };
};

export default useAdminCaseStudies;