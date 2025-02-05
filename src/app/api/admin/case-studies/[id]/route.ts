import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/utils/cache'
import { CaseStudyMapper } from '@/infrastructure/mappers/case-study.mapper'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    const { id } = await params
    const { locale } = await request.json()

    console.log('Processing case study deletion:', { id, locale })

    const { error } = await supabaseAdmin!
      .from(`case_studies_${locale}`)
      .delete()
      .match({ id })

    if (error) {
      console.error('Supabase delete error:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      throw error
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting case study:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete case study',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, locale } = await request.json()
    
    console.log('Processing case study update:', {
      id,
      locale,
      mappedData: CaseStudyMapper.toPersistence(data)
    })

    const { data: updatedCaseStudy, error } = await supabaseAdmin!
      .from(`case_studies_${locale}`)
      .update(CaseStudyMapper.toPersistence(data))
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', {
        code: error.code,
        message: error.message,
        details: error.details
      })
      
      // Handle case when no rows are found
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Case study not found', details: 'No case study exists with the provided ID' },
          { status: 404 }
        )
      }
      
      throw error
    }

    // Revalidate cache
    revalidateTag(CACHE_TAGS.CASE_STUDIES)

    return NextResponse.json(CaseStudyMapper.toDomain(updatedCaseStudy))
  } catch (error) {
    console.error('Error updating case study:', error)
    return NextResponse.json(
      { error: 'Failed to update case study', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 