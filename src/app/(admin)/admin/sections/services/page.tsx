import { AdminProvider } from '@/contexts/admin-context';
import { serviceService } from '@/lib/services/service.service';
import { Locale } from '@/i18n';
import { ServiceList } from './service-list';

async function getInitialServices(locale: Locale) {
  return await serviceService.getServices(locale);
}

export default async function ServicesPage() {
  const enServices = await getInitialServices('en');
  const plServices = await getInitialServices('pl');

  return (
    <AdminProvider initialServices={{ en: enServices, pl: plServices }}>
      <div className="bg-white shadow sm:rounded-lg">
        <ServiceList />
      </div>
    </AdminProvider>
  );
}
