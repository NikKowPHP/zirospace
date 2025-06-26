  import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    interface OldImageFormat {
      url: string;
      alt: string;
    }

    async function migrateLocale(locale: 'en' | 'pl') {
      console.log(`Starting migration for locale: ${locale.toUpperCase()}...`);

      const caseStudyModel = locale === 'en' ? prisma.zirospace_case_studies_en : prisma.zirospace_case_studies_pl;
      const caseStudyImageModel = locale === 'en' ? prisma.caseStudyImageEN : prisma.caseStudyImagePL;

      const caseStudies = await (caseStudyModel as any).findMany({
        where: {
          images_old: {
            not: null,
          },
        },
      });

      console.log(`Found ${caseStudies.length} case studies with images for locale ${locale}.`);

      for (const study of caseStudies) {
        if (!study.images_old || study.images_old.trim() === '') {
          continue;
        }

        try {
          const parsedImages: OldImageFormat[] = JSON.parse(study.images_old);

          if (Array.isArray(parsedImages) && parsedImages.length > 0) {
            console.log(`  Migrating ${parsedImages.length} images for case study: ${study.title}`);
            
            // Use Prisma's createMany for efficiency
            await (caseStudyImageModel as any).createMany({
              data: parsedImages.map(image => ({
                url: image.url,
                alt: image.alt,
                caseStudyId: study.id,
              })),
              skipDuplicates: true, // In case script is run multiple times
            });
          }
        } catch (error) {
          console.error(`  !! Failed to parse or migrate images for case study ID ${study.id}:`, error);
          console.error(`  !! Raw images string: ${study.images_old}`);
        }
      }

      console.log(`Migration for locale ${locale.toUpperCase()} complete.`);
    }

    async function main() {
      await migrateLocale('en');
      await migrateLocale('pl');
    }

    main()
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(async () => {
        await prisma.$disconnect();
      });