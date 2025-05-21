import { serviceService } from '@/lib/services/service.service';
import { Locale } from '@/i18n';
import { Metadata } from 'next';

interface Props {
  params: { locale: Locale };
}

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'pl' }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Our Services | ZIRO`,
  };
}

async function getServices(locale: Locale) {
  try {
    const services = await serviceService.getServices(locale);
    return services
      .filter((service) => service.isPublished)
      .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export default async function ServicesPage({ params: { locale } }: Props) {
  const services = await getServices(locale);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <div key={service.slug} className="bg-white rounded-lg shadow-md p-4">
            <a href={`/${locale}/services/${service.slug}`}>
              <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
              <p className="text-gray-700">{service.excerpt}</p>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}