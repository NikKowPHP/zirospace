'use client'

import { useState } from 'react'
import { useAdmin } from '@/contexts/admin-context'
import { CaseStudy } from '@/domain/models/case-study.model'
import { Locale } from '@/i18n'
import { CaseStudyForm } from './components/case-study-form'
import logger from '@/lib/logger'

export function CaseStudyList() {
  const {
    caseStudies,
    createCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    error,
    loading,
  } = useAdmin()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async (data: Partial<CaseStudy>) => {
    try {
      await createCaseStudy(data, activeLocale)
      setIsCreating(false)
    } catch (error) {
      logger.log('Failed to create case study:', error)
    }
  }

  const handleUpdate = async (data: Partial<CaseStudy>) => {
    if (!editingStudy) return
    try {
      await updateCaseStudy(editingStudy.id, data, activeLocale)
      setEditingStudy(null)
    } catch (error) {
      logger.log('Failed to update case study:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      try {
        await deleteCaseStudy(id, activeLocale)
      } catch (error) {
        logger.log('Failed to delete case study:', error)
      }
    }
  }

  return (
    <div className="space-y-8">
      {error && <div className="p-4 bg-red-50 text-red-600  ">{error}</div>}

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
          Add Case Study
        </button>
      </div>

      {(isCreating || editingStudy) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white   p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingStudy ? 'Edit Case Study' : 'New Case Study'}
            </h3>
            <CaseStudyForm
              study={editingStudy ?? undefined}
              locale={activeLocale}
              onSubmit={editingStudy ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingStudy(null)
                setIsCreating(false)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white   shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL Preview
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {caseStudies[activeLocale].map((study) => (
              <tr key={study.id} className={loading ? 'opacity-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {study.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{study.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    /case-studies/{study.slug}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">
                    {study.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button
                    onClick={() => setEditingStudy(study)}
                    className="text-primary hover:text-primary/90 disabled:opacity-50"
                    disabled={loading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(study.id)}
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
