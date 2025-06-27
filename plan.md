
### **Phase 2: The Migration and Data Transfer**

#### **Step 1: Define the New Schema Structure**

Edit your `prisma/schema.prisma` file. We will add the new models and relations but keep the old `images` column for now.

```prisma
// In prisma/schema.prisma

// --- English Models ---
model zirospace_case_studies_en {
  id               String    @id
  slug             String    @unique
  title            String
  // ... other fields ...
  
  images           String? // KEEP a reference to the old column for now
  
  // ADD the new relation
  case_study_images CaseStudyImageEN[]

  // ... rest of the model
}

model CaseStudyImageEN {
  id          String                    @id @default(cuid())
  url         String
  alt         String
  caseStudy   zirospace_case_studies_en @relation(fields: [caseStudyId], references: [id], onDelete: Cascade)
  caseStudyId String

  @@map("zirospace_case_study_images_en")
}


// --- Polish Models ---
model zirospace_case_studies_pl {
  id               String    @id
  slug             String    @unique
  title            String
  // ... other fields ...

  images           String? // KEEP a reference to the old column for now

  // ADD the new relation
  case_study_images CaseStudyImagePL[]

  // ... rest of the model
}

model CaseStudyImagePL {
  id          String                    @id @default(cuid())
  url         String
  alt         String
  caseStudy   zirospace_case_studies_pl @relation(fields: [caseStudyId], references: [id], onDelete: Cascade)
  caseStudyId String

  @@map("zirospace_case_study_images_pl")
}
```

#### **Step 2: Generate and Manually Edit the Migration File**

This is the key step that implements your plan.

1.  **Generate the migration file:**
    ```bash
    npx prisma migrate dev --name add-image-tables-and-rename-column
    ```
    Prisma will generate a new migration file. It will create the new tables and foreign keys. Now, we will manually add the `RENAME COLUMN` commands to this same migration file.

2.  **Edit the generated SQL migration:**
    *   Find the new file inside `prisma/migrations/`. It will have a name like `[timestamp]_add_image_tables_and_rename_column/migration.sql`.
    *   Open this `migration.sql` file.
    *   At the **very end** of the file, add the following SQL commands:

    ```sql
    -- Rename the old columns to prepare for data migration
    ALTER TABLE "public"."zirospace_case_studies_en" RENAME COLUMN "images" TO "images_old";
    ALTER TABLE "public"."zirospace_case_studies_pl" RENAME COLUMN "images" TO "images_old";
    ```
    By adding this, you are ensuring that the new tables are created AND the old column is renamed in a single, atomic migration step.

3.  **Run `migrate dev` again to apply the edited migration.** Since the file already exists, Prisma will just apply it.
    ```bash
    npx prisma migrate dev
    ```
    When prompted, confirm you want to apply the migration. Your database now has the new tables and the old data is safely stored in the `images_old` columns.

#### **Step 3: Run the Data Migration Script**

Your `prisma/migrate-images.ts` script is almost perfect. We just need to ensure it's reading from `images_old`.

1.  **Verify/Edit `prisma/migrate-images.ts`:**

    ```typescript
    // prisma/migrate-images.ts
    // ... (imports remain the same)

    async function migrateLocale(locale: 'en' | 'pl') {
      // ...
      const caseStudies = await (caseStudyModel as any).findMany({
        // NO CHANGE NEEDED HERE - because the schema still has `images`
      });
      // ...
      for (const study of caseStudies) {
        // ...
        try {
          // This must now read from the renamed column's data.
          // But since the Prisma schema field is still `images`, we use that.
          const parsedImages: OldImageFormat[] = JSON.parse(study.images);
          // ... (the rest of the script is correct)
        } catch (error) {
          // ...
        }
      }
    }
    // ...
    ```
    **Hold on.** Let's re-evaluate. The *database column* is renamed, but the *Prisma schema field* is still `images`. The script should work as-is. If it fails, it means the client isn't mapping correctly. Let's try to run it. If it fails with `Unknown field`, we will use the `@map` trick from the previous plan, but only for the data migration step.

2.  **Run the script:**
    ```bash
    npx tsx prisma/migrate-images.ts
    ```
    Verify the output and check your database to ensure the `zirospace_case_study_images_en/pl` tables are populated.

#### **Step 4: Final Cleanup Migration**

The data is now migrated. Let's drop the old `images_old` column.

1.  **Edit `prisma/schema.prisma`:**
    *   In both `zirospace_case_studies_en` and `zirospace_case_studies_pl`, **delete the `images String?` line.**
    *   (Optional but recommended) Rename the relation from `case_study_images` to `images` for cleaner code.
        ```prisma
        // Final state
        model zirospace_case_studies_en {
          //...
          images CaseStudyImageEN[] // Renamed
        }
        ```

2.  **Run the final migration:**
    ```bash
    npx prisma migrate dev --name drop-old-images-column
    ```
    This will generate and apply a migration that drops the `images_old` column from your database.

---

### **Phase 3: Application Code Refactoring**

Your database is now fully migrated and clean. Proceed with **Step 6** from the original plan: refactor your services, components, and admin forms to use the new `include` syntax and handle the relational `images` array.

This plan is much safer and more robust. Thank you for the excellent suggestion.