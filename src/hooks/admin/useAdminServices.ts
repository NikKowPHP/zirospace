import { useState, useCallback } from 'react';
import { Service } from '@/domain/models/models';
import { Locale } from '@/i18n';
import useAdminApi from './useAdminApi';
import logger from '@/lib/logger';

interface UseAdminServicesProps {
  initialServices?: Record<Locale, Service[]>;
}

const useAdminServices = ({ initialServices }: UseAdminServicesProps = {}) => {
  const [services, setServices] = useState<Record<Locale, Service[]>>(
    initialServices || { en: [], pl: [] }
  );
  const { loading, error, callApi, clearError } = useAdminApi();

  const getServices = useCallback(async (locale: Locale) => {
    try {
      const data: Service[] = await callApi(
        `/api/admin/services?locale=${locale}`,
        { method: 'GET', cache: 'no-store' },
        {
          loadingMessage: 'Fetching services...',
          errorMessage: 'Failed to fetch services',
        }
      );
      setServices((prev) => ({ ...prev, [locale]: data }));
    } catch (error) {
      // Error is already handled by useAdminApi
    }
  }, [callApi]);

  const getServiceById = useCallback(async (id: string, locale: Locale): Promise<Service | null> => {
    try {
      const data: Service = await callApi(
        `/api/admin/services/${id}?locale=${locale}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } },
        {
          loadingMessage: 'Fetching service details...',
          errorMessage: 'Failed to fetch service details',
        }
      );
      return data;
    } catch (error) {
      // Error is already handled by useAdminApi
      return null;
    }
  }, [callApi]);

  const createService = useCallback(
    async (data: Partial<Service>, locale: Locale) => {
      logger.log('createService', data)
      try {
        
        await callApi(
          `/api/admin/services?locale=${locale}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data }),
          },
          {
            loadingMessage: 'Creating service...',
            successMessage: 'Service created successfully!',
            errorMessage: 'Failed to create service',
          }
        );
        // After successful creation, refetch the list to ensure UI is in sync.
        await getServices(locale);
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi, getServices]
  );

  const updateService = useCallback(
    async (id: string, data: Partial<Service>, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/services/${id}?locale=${locale}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data }),
          },
          {
            loadingMessage: 'Updating service...',
            successMessage: 'Service updated successfully!',
            errorMessage: 'Failed to update service',
          }
        );
        // After successful update, refetch the list.
        await getServices(locale);
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi, getServices]
  );

  const deleteService = useCallback(
    async (id: string, locale: Locale) => {
      try {
        await callApi(
          `/api/admin/services/${id}?locale=${locale}`,
          {
            method: 'DELETE',
          },
          {
            loadingMessage: 'Deleting service...',
            successMessage: 'Service deleted successfully!',
            errorMessage: 'Failed to delete service',
          }
        );
        // After successful deletion, refetch the list.
        await getServices(locale);
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi, getServices]
  );

  return {
    services,
    loading,
    error,
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    clearError,
  };
};

export default useAdminServices;