import { unstable_cache } from 'next/cache'
import { SupabaseClient } from '@supabase/supabase-js'
import { CACHE_TAGS, CACHE_TIMES } from '@/lib/utils/cache'
import { supabase } from '../supabase'
import { TestimonialDTO } from '@/infrastructure/dto/testimonial.dto'
import { TestimonialMapper } from '@/infrastructure/mappers/testimonial.mapper'
import { Testimonial } from '@/domain/models/testimonial.model'
import { ITestimonialRepository } from '../interfaces/testimonials.interface'

export class TestimonialRepository implements ITestimonialRepository {
  private supabaseClient: SupabaseClient
  private tableName: string = 'zirospace_testimonials'
  constructor() {
    this.supabaseClient = supabase
  }

  getTestimonials = unstable_cache(
    async (locale: string): Promise<Testimonial[]> => {
      const tableName = `${this.tableName}_${locale}`
      const { data, error } = await this.supabaseClient
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching testimonials:', error)
        return []
      }

      return (data as TestimonialDTO[]).map(TestimonialMapper.toDomain)
    },
    [CACHE_TAGS.TESTIMONIALS],
    {
      revalidate: CACHE_TIMES.HOUR,
      tags: [CACHE_TAGS.TESTIMONIALS],
    }
  )

  getTestimonialById = async (id: string, locale: string): Promise<Testimonial | null> => {
    const tableName = `${this.tableName}_${locale}`
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching testimonial by ID:', error)
      return null
    }

    if (!data) {
      return null
    }

    return TestimonialMapper.toDomain(data as TestimonialDTO)
  }

  createTestimonial = async (testimonial: Omit<Testimonial, 'id'>, locale: string): Promise<Testimonial> => {
    const tableName = `${this.tableName}_${locale}`
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .insert([
        {
          author: testimonial.author,
          role: testimonial.role,
          company: testimonial.company,
          quote: testimonial.quote,
          image: testimonial.image,
          image_alt: testimonial.image_alt,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating testimonial:', error)
      throw new Error('Failed to create testimonial')
    }

    return TestimonialMapper.toDomain(data as TestimonialDTO)
  }

  updateTestimonial = async (id: string, testimonial: Partial<Testimonial>, locale: string): Promise<Testimonial | null> => {
    const tableName = `${this.tableName}_${locale}`
    const { data, error } = await this.supabaseClient
      .from(tableName)
      .update({
        author: testimonial.author,
        role: testimonial.role,
        company: testimonial.company,
        quote: testimonial.quote,
        image: testimonial.image,
        image_alt: testimonial.image_alt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating testimonial:', error)
      return null
    }

    if (!data) {
      return null
    }

    return TestimonialMapper.toDomain(data as TestimonialDTO)
  }

  deleteTestimonial = async (id: string, locale: string): Promise<boolean> => {
    const tableName = `${this.tableName}_${locale}`
    const { error } = await this.supabaseClient
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting testimonial:', error)
      return false
    }

    return true
  }
}

// export singleton
export const testimonialRepository = new TestimonialRepository()