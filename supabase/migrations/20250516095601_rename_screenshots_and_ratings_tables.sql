-- Disable RLS temporarily if needed for schema changes by superuser
-- SET session_replication_role = replica;

DO $$
DECLARE
    fk_record RECORD;
BEGIN
    -- == RENAME public.screenshots TO public.zirospace_screenshots ==

    -- Update FK in public.screenshot_ratings referencing 'public.screenshots'
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'screenshot_ratings') THEN
        FOR fk_record IN
            SELECT conname, conrelid::regclass::text as dependent_table
            FROM pg_constraint
            WHERE confrelid = 'public.screenshots'::regclass AND contype = 'f' AND conrelid = 'public.screenshot_ratings'::regclass
        LOOP
            EXECUTE 'ALTER TABLE ' || quote_ident(fk_record.dependent_table) || ' DROP CONSTRAINT ' || quote_ident(fk_record.conname);
        END LOOP;
    END IF;

    -- Rename the screenshots table
    ALTER TABLE IF EXISTS public.screenshots RENAME TO zirospace_screenshots;

    -- == RENAME public.screenshot_ratings TO public.zirospace_screenshot_ratings ==
    ALTER TABLE IF EXISTS public.screenshot_ratings RENAME TO zirospace_screenshot_ratings;

    -- Re-add FK from zirospace_screenshot_ratings to zirospace_screenshots
    ALTER TABLE public.zirospace_screenshot_ratings
        ADD CONSTRAINT zirospace_screenshot_ratings_screenshot_id_fkey FOREIGN KEY (screenshot_id) REFERENCES public.zirospace_screenshots(id) ON DELETE CASCADE;

    -- == RENAME public.app_ratings TO public.zirospace_app_ratings ==
    ALTER TABLE IF EXISTS public.app_ratings RENAME TO zirospace_app_ratings;

    -- Ensure FKs on the now renamed zirospace_screenshots and zirospace_app_ratings
    -- correctly point to zirospace_apps (if they weren't updated by the previous migration, this ensures they are)

    -- Drop existing FK from zirospace_screenshots to apps (if it exists from original creation)
    FOR fk_record IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.zirospace_screenshots'::regclass AND confrelid = 'public.zirospace_apps'::regclass AND contype = 'f'
          AND conname = 'screenshots_app_id_fkey' -- The name it would have from previous migration step
    LOOP
        EXECUTE 'ALTER TABLE public.zirospace_screenshots DROP CONSTRAINT ' || quote_ident(fk_record.conname);
    END LOOP;
    
    -- Re-add FK from zirospace_screenshots to zirospace_apps
    ALTER TABLE public.zirospace_screenshots
        ADD CONSTRAINT zirospace_screenshots_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.zirospace_apps(id) ON DELETE CASCADE;

    -- Drop existing FK from zirospace_app_ratings to apps (if it exists from original creation)
     FOR fk_record IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.zirospace_app_ratings'::regclass AND confrelid = 'public.zirospace_apps'::regclass AND contype = 'f'
          AND conname = 'app_ratings_app_id_fkey' -- The name it would have from previous migration step
    LOOP
        EXECUTE 'ALTER TABLE public.zirospace_app_ratings DROP CONSTRAINT ' || quote_ident(fk_record.conname);
    END LOOP;
    
    -- Re-add FK from zirospace_app_ratings to zirospace_apps
    ALTER TABLE public.zirospace_app_ratings
        ADD CONSTRAINT zirospace_app_ratings_app_id_fkey FOREIGN KEY (app_id) REFERENCES public.zirospace_apps(id) ON DELETE CASCADE;


    -- Enable RLS and define policies for the renamed tables (if not already set or to ensure they are correct)
    -- public.zirospace_screenshots
    ALTER TABLE public.zirospace_screenshots ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read access for zirospace_screenshots" ON public.zirospace_screenshots;
    CREATE POLICY "Public read access for zirospace_screenshots" ON public.zirospace_screenshots FOR SELECT USING (true);
    -- Add policies for insert, update, delete for authenticated users or admins as needed
    -- Example: CREATE POLICY "Admin can manage zirospace_screenshots" ON public.zirospace_screenshots FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');


    -- public.zirospace_screenshot_ratings
    ALTER TABLE public.zirospace_screenshot_ratings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read access for zirospace_screenshot_ratings" ON public.zirospace_screenshot_ratings;
    CREATE POLICY "Public read access for zirospace_screenshot_ratings" ON public.zirospace_screenshot_ratings FOR SELECT USING (true);
    -- Add policies for insert, update, delete for authenticated users or admins as needed
    -- Example: CREATE POLICY "Users can manage their own zirospace_screenshot_ratings" ON public.zirospace_screenshot_ratings FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    -- Example: CREATE POLICY "Admin can manage all zirospace_screenshot_ratings" ON public.zirospace_screenshot_ratings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

    -- public.zirospace_app_ratings
    ALTER TABLE public.zirospace_app_ratings ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Public read access for zirospace_app_ratings" ON public.zirospace_app_ratings;
    CREATE POLICY "Public read access for zirospace_app_ratings" ON public.zirospace_app_ratings FOR SELECT USING (true);
    -- Example: CREATE POLICY "Users can manage their own zirospace_app_ratings" ON public.zirospace_app_ratings FOR ALL USING (auth.uid()::text = user_id) WITH CHECK (auth.uid()::text = user_id);
    -- Example: CREATE POLICY "Admin can manage all zirospace_app_ratings" ON public.zirospace_app_ratings FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

    -- Add/Update trigger for 'updated_at' on zirospace_screenshots if it doesn't use the generic one
    DROP TRIGGER IF EXISTS set_timestamp_on_screenshots_update ON public.zirospace_screenshots; -- Drop old if exists
    CREATE TRIGGER set_timestamp_on_zirospace_screenshots_update
    BEFORE UPDATE ON public.zirospace_screenshots
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); -- Assuming handle_updated_at is created by previous migration

    -- Add/Update trigger for 'updated_at' on zirospace_app_ratings
    DROP TRIGGER IF EXISTS set_timestamp_on_app_ratings_update ON public.zirospace_app_ratings;
    CREATE TRIGGER set_timestamp_on_zirospace_app_ratings_update
    BEFORE UPDATE ON public.zirospace_app_ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

    -- Add/Update trigger for 'updated_at' on zirospace_screenshot_ratings
    DROP TRIGGER IF EXISTS set_timestamp_on_screenshot_ratings_update ON public.zirospace_screenshot_ratings;
    CREATE TRIGGER set_timestamp_on_zirospace_screenshot_ratings_update
    BEFORE UPDATE ON public.zirospace_screenshot_ratings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

END;
$$;

-- SET session_replication_role = DEFAULT;