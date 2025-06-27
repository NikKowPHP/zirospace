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
        { method: 'GET' },
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
        
        const newService: Service = await callApi(
          `/api/admin/services`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, locale }),
          },
          {
            loadingMessage: 'Creating service...',
            successMessage: 'Service created successfully!',
            errorMessage: 'Failed to create service',
          }
        );
        setServices((prev) => ({
          ...prev,
          [locale]: [...(prev[locale] || []), newService],
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
  );

  const updateService = useCallback(
    async (id: string, data: Partial<Service>, locale: Locale) => {
      try {
        const updatedService: Service = await callApi(
          `/api/admin/services/${id}?locale=${locale}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data, locale }),
          },
          {
            loadingMessage: 'Updating service...',
            successMessage: 'Service updated successfully!',
            errorMessage: 'Failed to update service',
          }
        );
        setServices((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).map((service) =>
            service.id === id ? updatedService : service
          ),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
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
        setServices((prev) => ({
          ...prev,
          [locale]: (prev[locale] || []).filter((service) => service.id !== id),
        }));
      } catch (error) {
        // Error is already handled by useAdminApi
      }
    },
    [callApi]
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