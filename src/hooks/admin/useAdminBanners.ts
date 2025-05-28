'use client';
import { useState, useCallback } from 'react';
import { Banner } from '@/domain/models/banner.model';
import { Locale } from '@/i18n';
import useAdminApi from './useAdminApi';

interface UseAdminBannersProps {
  initialBanners?: Record<Locale, Banner[]>;
}

const useAdminBanners = ({ initialBanners }: UseAdminBannersProps = {}) => {
  const [banners, setBanners] = useState<Record<Locale, Banner[]>>(
    initialBanners || { en: [], pl: [] }
  );
  const { loading, error, callApi, clearError } = useAdminApi();

  const getBanners = useCallback(async (locale: Locale) => {
    try {
      const data: Banner[] = await callApi(
        `/api/admin/banners?locale=${locale}`,
        { method: 'GET' },
        {
          loadingMessage: 'Fetching banners...',
          errorMessage: 'Failed to fetch banners',
        }
      );
      setBanners((prev) => ({ ...prev, [locale]: data }));
    } catch (error) {
      // Error is already handled by useAdminApi
    }
  }, [callApi]);

  const createBanner = useCallback(
    async (data: Partial<Banner>, locale: Locale) => {
      try {
        const newBanner: Banner = await callApi(
          `/api/admin/banners`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Creating banner...',
            successMessage: 'Banner created successfully!',
            errorMessage: 'Failed to create banner',
          }
        );
        setBanners((prev) => ({
          ...prev,
          [locale]: [...(prev[locale] || []), newBanner],
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateBanner = useCallback(
    async (id: string, data: Partial<Banner>, locale: Locale) => {
      try {
        const updatedBanner: Banner = await callApi(
          `/api/admin/banners/${id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Updating banner...',
            successMessage: 'Banner updated successfully!',
            errorMessage: 'Failed to update banner',
          }
        );
        setBanners((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).map((banner) =>
            banner.id === id ? updatedBanner : banner
          ),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const deleteBanner = useCallback(
    async (id: string, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/banners/${id}`,
          {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locale }),
          },
          {
            loadingMessage: 'Deleting banner...',
            successMessage: 'Banner deleted successfully!',
            errorMessage: 'Failed to delete banner',
          }
        );
        setBanners((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).filter((banner) => banner.id !== id),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  return {
    banners,
    loading,
    error,
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    clearError,
  };
};

export default useAdminBanners;