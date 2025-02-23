import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'
import { CaseStudySliderDTO, CaseStudySliderImageDTO } from '@/infrastructure/dto/case-study-slider.dto'
import { CaseStudySliderMapper, CaseStudySliderImagesMapper } from '@/infrastructure/mappers/case-study-slider.mapper'
import { CaseStudySlider, CaseStudyImage } from '@/domain/models/case-study-slider.model'
import { ICaseStudySliderRepository } from '../interfaces/caseStudySliderRepository.interface'
import logger from '@/lib/logger'


export class CaseStudySliderRepository implements ICaseStudySliderRepository {
  private supabaseClient: SupabaseClient
  private slidersTable: string = 'zirospace_case_study_sliders'
  private imagesTable: string = 'zirospace_case_study_slider_images'
  constructor() {
      this.supabaseClient = supabase
  }

  getCaseStudiesSliders = async (): Promise<CaseStudySlider[]> => {
    const { data: slidersData, error: slidersError } = await this.supabaseClient
      .from(this.slidersTable)
      .select(`
        *,
        ${this.imagesTable} (*)
      `)
      .order('created_at', { ascending: false });
    console.log('slidersData', slidersData)

    if (slidersError) {
      logger.log('Error fetching sliders:', slidersError);
      return [];
    }

    const sliders = (slidersData as any[]).map(slider => ({
      ...CaseStudySliderMapper.toDomain(slider),
      images: slider[this.imagesTable].map((img: any) => ({
        id: img.id,
        image: img.image,
        alt: img.alt
      }))
    }));
    return sliders
  }

  async createCaseStudySlider(caseStudySlider: CaseStudySlider): Promise<CaseStudySlider> {
    // Create slider first without images
    const { data: sliderData, error: sliderError } = await this.supabaseClient
      .from(this.slidersTable)
      .insert([{
        ...CaseStudySliderMapper.toPersistence(caseStudySlider),
        created_at: new Date().toISOString()
      }])
      .select();

    if (sliderError) {
      logger.log('Error creating slider:', sliderError);
      throw new Error(`Failed to create slider: ${sliderError.message}`);
    }

    // Handle images separately
    if (caseStudySlider.images?.length) {
      const { error: imagesError } = await this.supabaseClient
        .from(this.imagesTable)
        .insert(caseStudySlider.images.map(image => ({
          id: image.id,
          slider_id: sliderData[0].id,
          image: image.image,
          alt: image.alt,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })))
        .select();

      if (imagesError) {
        logger.log('Error creating images:', imagesError);
        throw new Error(`Failed to create images: ${imagesError.message}`);
      }
    }

    const slider = CaseStudySliderMapper.toDomain(sliderData[0] as CaseStudySliderDTO);
    const images = await this.getCaseStudySliderImages(slider.id);
    return { ...slider, images };
  }


  getCaseStudySliderById = unstable_cache(
    async (id: string): Promise<CaseStudySlider | null> => {
      const { data, error } = await this.supabaseClient
        .from(this.slidersTable)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.log('Error fetching slider:', error);
        return null;
      }

      const slider = CaseStudySliderMapper.toDomain(data as CaseStudySliderDTO);
      const images = await this.getCaseStudySliderImages(id);
      return { ...slider, images };
    },
    [CACHE_TAGS.CASE_STUDY_SLIDERS],
    {
      revalidate: CACHE_TIMES.MINUTE,
      tags: [CACHE_TAGS.CASE_STUDY_SLIDERS],
    }
  )

  getCaseStudySliderImages = unstable_cache(
    async (id: string): Promise<CaseStudyImage[]> => {
      const { data, error } = await this.supabaseClient
        .from(this.imagesTable)
        .select('*')
        .eq('slider_id', id);

      if (error) {
        logger.log('Error fetching images:', error);
        return [];
      }

      return data.map(image => CaseStudySliderImagesMapper.toDomain(image as CaseStudySliderImageDTO));
    },
    [CACHE_TAGS.CASE_STUDY_SLIDERS],
    {
      revalidate: CACHE_TIMES.MINUTE,
      tags: [CACHE_TAGS.CASE_STUDY_SLIDERS],
    }
  )

  async updateCaseStudySlider(id: string, caseStudySlider: Partial<CaseStudySlider>): Promise<CaseStudySlider | null> {
    console.log('updating case study slider aaaaaaaaaaa', CaseStudySliderMapper.toPersistence(caseStudySlider))
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
          id: image.id,
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
  console.log('processing case study slider with data', data)

  console.log('appended data ', caseStudySlider)

  return caseStudySlider as CaseStudySlider;
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