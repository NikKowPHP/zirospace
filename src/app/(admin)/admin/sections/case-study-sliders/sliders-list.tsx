'use client'

import { useEffect, useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { Locale } from '@/i18n'
import { CaseStudySliderForm } from './components/slider-form'
import { CaseStudySlider } from '@/domain/models/case-study-slider.model'

export function CaseStudySliderList() {
  const { 
    caseStudySliders, 
    createCaseStudySlider, 
    updateCaseStudySlider, 
    deleteCaseStudySlider, 
    error, 
    loading, 
    getCaseStudySliders 
  } = useAdmin()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [editingCaseStudySlider, setEditingCaseStudySlider] = useState<CaseStudySlider | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    getCaseStudySliders(activeLocale);
  }, [activeLocale, getCaseStudySliders]);
  
  const handleCreate = async (data: Partial<CaseStudySlider>) => {
    try {
      await createCaseStudySlider(data, activeLocale)
      setIsCreating(false)
    } catch (error) {
      console.error('Failed to create case study slider:', error)
    }
  }

  const handleUpdate = async (data: Partial<CaseStudySlider>) => {
    if (!editingCaseStudySlider) return
    try {
      await updateCaseStudySlider(editingCaseStudySlider.id, data, activeLocale)
      setEditingCaseStudySlider(null)
    } catch (error) {
      console.error('Failed to update case study slider:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study slider?')) {
      try {
        await deleteCaseStudySlider(id, activeLocale)
      } catch (error) {
        console.error('Failed to delete case study slider:', error)
      }
    }
  }

  useEffect(() => { console.log(caseStudySliders) }, [caseStudySliders])

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-primary">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveLocale('en')}
            className={`px-6 py-3 rounded-full transition-colors ${
              activeLocale === 'en' 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-gray-700 hover:bg-secondary/80'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setActiveLocale('pl')}
            className={`px-6 py-3 rounded-full transition-colors ${
              activeLocale === 'pl' 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-gray-700 hover:bg-secondary/80'
            }`}
          >
            Polish
          </button>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-6 py-3 text-white bg-primary rounded-full hover:bg-primary/90 transition-colors"
          disabled={loading}
        >
          Add Case Study Slider
        </button>
      </div>

      {(isCreating || editingCaseStudySlider) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-primary p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingCaseStudySlider ? 'Edit Case Study Slider' : 'New Case Study Slider'}
            </h3>
            <CaseStudySliderForm
              caseStudySlider={editingCaseStudySlider ?? undefined}
              locale={activeLocale}
              onSubmit={editingCaseStudySlider ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingCaseStudySlider(null)
                setIsCreating(false)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white rounded-primary shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Theme
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {caseStudySliders?.map((slider) => (
              <tr key={slider.id} className={loading ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {slider.theme}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => setEditingCaseStudySlider(slider)}
                    className="text-primary hover:text-primary/90 disabled:opacity-50"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}