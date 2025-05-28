
import { Metadata } from "next";
import { UpdateService } from "@/lib/services/update.service";
import { notFound } from "next/navigation";


export const generateMetadata = async ({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> => {
  return {
    title: "Updates | Zirospace",
    description: "Stay up-to-date with the latest news and updates from Zirospace.",
    // JSON-LD
    openGraph: {
      title: "Updates | Zirospace",
      description: "Stay up-to-date with the latest news and updates from Zirospace.",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/updates`,
      siteName: "Zirospace",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Updates | Zirospace",
      description: "Stay up-to-date with the latest news and updates from Zirospace.",
      site: "@zirospace",
      creator: "@zirospace",
    },
    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),
    alternates: {
      canonical: `/${locale}/updates`,
      languages: {
        "en-US": "/en/updates",
        "pl-PL": "/pl/updates",
      },
    },
  };
};
const UpdatesPage = async ({ params: { locale } }: { params: { locale: string } }) => {
  try {
    const updateService = new UpdateService();
    const updates = await updateService.getUpdates(locale);

    if (!updates) {
      notFound();
    }

    const sortedUpdates = [...updates].sort((a, b) => {
      const publishDateComparison = (b.publish_date?.getTime() || 0) - (a.publish_date?.getTime() || 0);
      if (publishDateComparison !== 0) {
        return publishDateComparison;
      }
      return (a.order_index || 0) - (b.order_index || 0);
    });

    return (
      <div>
        <h1>Updates</h1>
        {sortedUpdates.map((update) => (
          <div key={update.id}>
            <h2>{update.title}</h2>
            <p>{update.publish_date?.toLocaleDateString()}</p>
            {update.image_url && <img src={update.image_url} alt={update.title} />}
            <div dangerouslySetInnerHTML={{ __html: update.content_html || "" }} />
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching updates:", error);
    notFound();
    return null;
  }
};

export default UpdatesPage;