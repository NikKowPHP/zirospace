
'use client'

import { useEffect, useState } from 'react'
import useAdminAdvisors from '@/hooks/admin/useAdminAdvisors'
import { Advisor } from '@/domain/models/models'
import { Locale } from '@/i18n'
import { AdvisorForm } from './components/advisor-form'
import logger from '@/lib/logger'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'

export function AdvisorList() {
  const {
    advisors,
    createAdvisor,
    updateAdvisor,
    deleteAdvisor,
    updateAdvisorOrder,
    error,
    loading,
    getAdvisors,
  } = useAdminAdvisors()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [editingAdvisor, setEditingAdvisor] =
    useState<Advisor | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [orderedAdvisors, setOrderedAdvisors] = useState<Advisor[]>(
    []
  )

  useEffect(() => {
    getAdvisors(activeLocale)
  }, [activeLocale, getAdvisors])

  useEffect(() => {
    setOrderedAdvisors(advisors[activeLocale] || [])
  }, [activeLocale, advisors])

  const handleCreate = async (data: Partial<Advisor>) => {
    try {
      await createAdvisor(data, activeLocale)
      setIsCreating(false)
    } catch (error) {
      logger.log('Failed to create advisor:', error)
    }
  }

  const handleUpdate = async (data: Partial<Advisor>) => {
    if (!editingAdvisor) return
    try {
      await updateAdvisor(editingAdvisor.id, data, activeLocale)
      setEditingAdvisor(null)
    } catch (error) {
      logger.log('Failed to update advisor:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this advisor?')) {
      try {
        await deleteAdvisor(id, activeLocale)
      } catch (error) {
        logger.log('Failed to delete advisor:', error)
      }
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(orderedAdvisors)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setOrderedAdvisors(items)

    const orders = items.map((advisor, index) => ({
      id: advisor.id,
      order: index,
    }))
    try {
      await updateAdvisorOrder(orders, activeLocale)
    } catch (error) {
      console.error('Failed to update order:', error)
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
          Add Advisor
        </button>
      </div>

      {(isCreating || editingAdvisor) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingAdvisor ? 'Edit Advisor' : 'New Advisor'}
            </h3>
            <AdvisorForm
              advisor={editingAdvisor ?? undefined}
              onSubmit={editingAdvisor ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingAdvisor(null)
                setIsCreating(false)
              }}
              loading={loading}
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="advisors">
              {(provided) => (
                <tbody
                  className="divide-y divide-gray-200"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {orderedAdvisors.map((advisor, index) => (
                    <Draggable
                      key={advisor.id}
                      draggableId={advisor.id}
                      index={index}
                    >
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={loading ? 'opacity-50' : ''}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {advisor.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {advisor.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button
                              onClick={() => setEditingAdvisor(advisor)}
                              className="text-primary hover:text-primary/90 disabled:opacity-50"
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(advisor.id)}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </DragDropContext>
        </table>
      </div>
    </div>
  )
}