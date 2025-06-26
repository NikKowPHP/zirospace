import { useState, useCallback } from 'react';
import { CaseStudySlider } from '@/domain/models/models';
import useAdminApi from './useAdminApi';
import logger from '@/lib/logger';

interface UseAdminCaseStudySlidersProps {
  initialCaseStudySliders?: CaseStudySlider[];
}

const useAdminCaseStudySliders = ({ initialCaseStudySliders }: UseAdminCaseStudySlidersProps = {}) => {
  const [caseStudySliders, setCaseStudySliders] = useState<CaseStudySlider[]>(
    initialCaseStudySliders || []
  );
  const { loading, error, callApi, clearError } = useAdminApi();

  const getCaseStudySliders = useCallback(async () => {
    try {
      const data: CaseStudySlider[] = await callApi(
        `/api/admin/case-study-sliders`,
        { method: 'GET' },
        {
          loadingMessage: 'Fetching case study sliders...',
          errorMessage: 'Failed to fetch case study sliders',
        }
      );
  
      logger.log('case study sliders data ' + data)
      setCaseStudySliders(data);
    } catch (error) {
      // Error is already handled by useAdminApi
    }
  }, [callApi]);

  const createCaseStudySlider = useCallback(
    async (data: Partial<CaseStudySlider>) => {
      try {
        const newCaseStudySlider: CaseStudySlider = await callApi(
          `/api/admin/case-study-sliders`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data }),
          },
          {
            loadingMessage: 'Creating case study slider...',
            successMessage: 'Case study slider created successfully!',
            errorMessage: 'Failed to create case study slider',
          }
        );
        setCaseStudySliders((prev) => [...prev, newCaseStudySlider]);
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateCaseStudySlider = useCallback(
    async (id: string, data: Partial<CaseStudySlider>) => {
      try {
        
        const updatedCaseStudySlider: CaseStudySlider = await callApi(
          `/api/admin/case-study-sliders/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, id }),
          },
          {
            loadingMessage: 'Updating case study slider...',
            successMessage: 'Case study slider updated successfully!',
            errorMessage: 'Failed to update case study slider',
          }
        );
        setCaseStudySliders((prev) =>
          prev.map((slider) => (slider.id === id ? updatedCaseStudySlider : slider))
        );
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const deleteCaseStudySlider = useCallback(
    async (id: string) => {
      try {
        await callApi(
          `/api/admin/case-study-sliders/${id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({ id }),
          },
          {
            loadingMessage: 'Deleting case study slider...',
            successMessage: 'Case study slider deleted successfully!',
            errorMessage: 'Failed to delete case study slider',
          }
        );
        setCaseStudySliders((prev) => prev.filter((slider) => slider.id !== id));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  return {
    caseStudySliders,
    loading,
    error,
    getCaseStudySliders,
    createCaseStudySlider,
    updateCaseStudySlider,
    deleteCaseStudySlider,
    clearError,
  };
};

export default useAdminCaseStudySliders;