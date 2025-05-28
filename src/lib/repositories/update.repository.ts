import { IUpdatesRepository } from "@/lib/interfaces/updatesRepository.interface";
import { Update } from "@/domain/models/update.model";
import { supabase } from "@/lib/supabase";
import { UpdateMapper } from "@/infrastructure/mappers/update.mapper";
import { UpdateDTO } from "@/infrastructure/dto/update.dto";
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from "@/lib/utils/cache";

export class UpdateRepository implements IUpdatesRepository {
  async getUpdates(locale: string): Promise<Update[]> {
    return unstable_cache(
      async () => {
        const { data, error } = await supabase
          .from(\`zirospace_updates_\${locale}\`)
          .select('*')
          

        if (error) {
          console.error(error);
          throw new Error(error.message);
        }

        return data.map((updateDTO: UpdateDTO) => UpdateMapper.toDomain(updateDTO));
      },
      [CACHE_TAGS.UPDATES],
      {
        revalidate: 60, // Revalidate every 60 seconds
      }
    )();
  }

  async getUpdateBySlug(slug: string): Promise<Update | null> {
    return unstable_cache(
      async () => {
        const { data, error } = await supabase
          .from('zirospace_updates_en')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error(error);
          return null;
        }

        if (!data) {
          return null;
        }

        return UpdateMapper.toDomain(data);
      },
      [CACHE_TAGS.UPDATES, slug],
      {
        revalidate: 60, // Revalidate every 60 seconds
      }
    )();
  }

  async getUpdateById(id: string): Promise<Update | null> {
    return unstable_cache(
      async () => {
        const { data, error } = await supabase
          .from('zirospace_updates_en')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error(error);
          return null;
        }

        if (!data) {
          return null;
        }

        return UpdateMapper.toDomain(data);
      },
      [CACHE_TAGS.UPDATES, id],
      {
        revalidate: 60, // Revalidate every 60 seconds
      }
    )();
  }

  async createUpdate(update: Update): Promise<Update> {
    const updateDTO = UpdateMapper.toPersistence(update);

    const { data, error } = await supabase
      .from('zirospace_updates_en')
      .insert([updateDTO])
      .select('*')
      .single();

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return UpdateMapper.toDomain(data);
  }

  async updateUpdate(id: string, update: Update): Promise<Update> {
    const updateDTO = UpdateMapper.toPersistence(update);

    const { data, error } = await supabase
      .from('zirospace_updates_en')
      .update(updateDTO)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }

    return UpdateMapper.toDomain(data);
  }

  async deleteUpdate(id: string): Promise<void> {
    const { error } = await supabase
      .from('zirospace_updates_en')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }
}