import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'
import { CaseStudySliderDTO } from '@/infrastructure/dto/case-study-slider.dto'
import { CaseStudySliderMapper } from '@/infrastructure/mappers/case-study-slider.mapper'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'
import { ICaseStudySliderRepository } from '../interfaces/caseStudySliderRepository.interface'
import logger from '@/lib/logger'


export class CaseStudySliderRepository implements ICaseStudySliderRepository {
  private supabaseClient: SupabaseClient
  private slidersTable: string = 'zirospace_case_study_sliders'
  private imagesTable: string = 'zirospace_case_study_slider_images'
  constructor() {
      this.supabaseClient = supabase
  }

  getCaseStudiesSliders = unstable_cache(
    async (): Promise<CaseStudySlider[]> => {
      const { data: slidersData, error: slidersError } = await this.supabaseClient
      .from(this.slidersTable)
      .select(`
        *,
        ${this.imagesTable} (*)
      `)
      .order('created_at', { ascending: false });

    if (slidersError) {
      logger.log('Error fetching sliders:', slidersError);
      return [];
    }

    return (slidersData as any[]).map(slider => ({
      ...CaseStudySliderMapper.toDomain(slider),
      images: slider[this.imagesTable].map((img: any) => ({
        id: img.id,
        image: img.image,
        alt: img.alt
      }))
    }));
    
    },
    [CACHE_TAGS.CASE_STUDY_SLIDERS],
    {
      revalidate: CACHE_TIMES.HOUR,
      tags: [CACHE_TAGS.CASE_STUDY_SLIDERS],
    }
  )

  async createCaseStudySlider(caseStudySlider: CaseStudySlider): Promise<CaseStudySlider> {
    const { data: sliderData, error: sliderError } = await this.supabaseClient
    .from(this.slidersTable)
    .insert([CaseStudySliderMapper.toPersistence(caseStudySlider)])
    .select();

  if (sliderError) {
    logger.log('Error creating slider:', sliderError);
    throw new Error(`Failed to create slider: ${sliderError.message}`);
  }

  // Create images
  if (caseStudySlider.images?.length) {
    const { error: imagesError } = await this.supabaseClient
      .from(this.imagesTable)
      .insert(caseStudySlider.images.map(image => ({
        slider_id: sliderData[0].id,
        image: image.image,
        alt: image.alt
      })));

    if (imagesError) {
      logger.log('Error creating images:', imagesError);
      throw new Error(`Failed to create images: ${imagesError.message}`);
    }
  }
  return CaseStudySliderMapper.toDomain(sliderData[0] as CaseStudySliderDTO);
  }

  async updateCaseStudySlider(id: string, caseStudySlider: Partial<CaseStudySlider>): Promise<CaseStudySlider | null> {
    const { data, error } = await this.supabaseClient
    .from(this.slidersTable)
    .update(CaseStudySliderMapper.toPersistence(caseStudySlider))
    .eq('id', id)
    .select();

  if (error) {
    logger.log('Error updating slider:', error);
    return null;
  }

  // Update images (delete existing and create new)
  if (caseStudySlider.images) {
    // Delete existing images
    await this.supabaseClient
      .from(this.imagesTable)
      .delete()
      .eq('slider_id', id);

    // Insert new images
    if (caseStudySlider.images.length > 0) {
      const { error: imagesError } = await this.supabaseClient
        .from(this.imagesTable)
        .insert(caseStudySlider.images.map(image => ({
          slider_id: id,
          image: image.image,
          alt: image.alt
        })));

      if (imagesError) {
        logger.log('Error updating images:', imagesError);
        throw new Error(`Failed to update images: ${imagesError.message}`);
      }
    }
  }

  return CaseStudySliderMapper.toDomain(data[0] as CaseStudySliderDTO);
  }

  async deleteCaseStudySlider(id: string): Promise<void> {
    // Delete images first
    await this.supabaseClient
      .from(this.imagesTable)
      .delete()
      .eq('slider_id', id);

    // Then delete slider
    const { error } = await this.supabaseClient
      .from(this.slidersTable)
      .delete()
      .eq('id', id);

    if (error) {
      logger.log('Error deleting slider:', error);
      throw new Error(`Failed to delete slider: ${error.message}`);
    }
  }
}

// export singleton
export const caseStudySliderRepository = new CaseStudySliderRepository();