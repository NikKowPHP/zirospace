Of course. I will create a new "Advisors" section, which will be similar to the testimonials section, complete with reordering functionality in the admin panel. The public-facing section will only be displayed if there are advisors available in the database.

Here is my plan:

1.  **Database Schema:** I'll start by updating the `prisma/schema.prisma` file to include `zirospace_advisors_en` and `zirospace_advisors_pl` tables. These tables will store the advisor's name, role, image, and an `order_index` for reordering. I will then create a new migration file to apply these changes.

2.  **Models and Services:** I'll define a new `Advisor` model in `src/domain/models/models.ts` and create a corresponding `advisor.service.ts` in `src/lib/services/` to handle all database interactions, including fetching advisors sorted by their order.

3.  **API Endpoints:** I will create the necessary API endpoints under `src/app/api/admin/advisors/` to manage CRUD operations and reordering for the advisors.

4.  **Admin Panel UI:**
    *   A new hook, `useAdminAdvisors.ts`, will be created to manage the state for the advisors section.
    *   I will build out the admin interface under `src/app/(admin)/admin/sections/advisors/` with a list view supporting drag-and-drop reordering and a form for creating/editing advisors.
    *   Finally, I'll add a link to the new "Advisors" section in the admin sidebar.

5.  **Public-Facing UI:**
    *   I'll create a new component, `src/components/sections/advisors/advisors.tsx`, to display the advisors on the public website. This component will fetch the advisors and will render nothing if the list is empty.
    *   This new section will be dynamically imported and added to the main page layout.

6.  **Cache Management:** I'll add a new cache tag for advisors to ensure data is properly invalidated when changes are made.

### BASH COMMANDS
```bash
mkdir -p "prisma/migrations/20250627110000_add_advisors_table"
touch "prisma/migrations/20250627110000_add_advisors_table/migration.sql"
touch "src/lib/services/advisor.service.ts"
mkdir -p "src/app/api/admin/advisors/[id]"
touch "src/app/api/admin/advisors/route.ts"
touch "src/app/api/admin/advisors/[id]/route.ts"
mkdir -p  "src/app/api/admin/advisors-order/"
touch "src/app/api/admin/advisors-order/route.ts"
touch "src/hooks/admin/useAdminAdvisors.ts"
mkdir -p "src/app/(admin)/admin/sections/advisors/components"
touch "src/app/(admin)/admin/sections/advisors/page.tsx"
touch "src/app/(admin)/admin/sections/advisors/advisors-list.tsx"
touch "src/app/(admin)/admin/sections/advisors/components/advisor-form.tsx"
mkdir -p "src/components/sections/advisors"
touch "src/components/sections/advisors/advisors.tsx"
```
-------------------------------------------------------------------------------
### prisma/migrations/20250627110000_add_advisors_table/migration.sql
```sql
-- CreateTable
CREATE TABLE "zirospace_advisors_en" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_advisors_en_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zirospace_advisors_pl" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT,
    "image_url" TEXT,
    "image_alt" TEXT,
    "order_index" INTEGER DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "zirospace_advisors_pl_pkey" PRIMARY KEY ("id")
);
```
-------------------------------------------------------------------------------
### prisma/schema.prisma
```prisma
```
-------------------------------------------------------------------------------
### src/domain/models/models.ts
```typescript
```
-------------------------------------------------------------------------------
### src/lib/services/advisor.service.ts
```typescript
```
-------------------------------------------------------------------------------
### src/lib/utils/cache.ts
```typescript
```
-------------------------------------------------------------------------------
### src/app/api/admin/advisors/route.ts
```typescript
```
-------------------------------------------------------------------------------
### src/app/api/admin/advisors/[id]/route.ts
```typescript
```
-------------------------------------------------------------------------------
### src/app/api/admin/advisors-order/route.ts
```typescript
```
-------------------------------------------------------------------------------
### src/hooks/admin/useAdminAdvisors.ts
```typescript
```
-------------------------------------------------------------------------------
### src/app/(admin)/admin/sections/advisors/page.tsx
```tsx
```
-------------------------------------------------------------------------------
### src/app/(admin)/admin/sections/advisors/advisors-list.tsx
```tsx
```
-------------------------------------------------------------------------------
### src/app/(admin)/admin/sections/advisors/components/advisor-form.tsx
```tsx
```
-------------------------------------------------------------------------------
### src/app/(admin)/admin/sections/layout.tsx
```tsx
```
-------------------------------------------------------------------------------
### src/components/sections/advisors/advisors.tsx
```typescript
```
-------------------------------------------------------------------------------
### src/helpers/componentsLoad.tsx
```typescript
```
-------------------------------------------------------------------------------
### src/app/[locale]/page.tsx
```typescript
```