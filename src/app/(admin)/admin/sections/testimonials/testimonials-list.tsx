
'use client'

import { useEffect, useState } from 'react'
import useAdminTestimonials from '@/hooks/admin/useAdminTestimonials'
import { Testimonial } from '@/domain/models/models'
import { Locale } from '@/i18n'
import { TestimonialForm } from './components/testimonials-form'
import logger from '@/lib/logger'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd'

export function TestimonialList() {
  const {
    testimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    updateTestimonialOrder,
    error,
    loading,
    getTestimonials,
  } = useAdminTestimonials()
  const [activeLocale, setActiveLocale] = useState<Locale>('en')
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [orderedTestimonials, setOrderedTestimonials] = useState<Testimonial[]>(
    []
  )

  useEffect(() => {
    getTestimonials(activeLocale)
  }, [activeLocale, getTestimonials])

  useEffect(() => {
    setOrderedTestimonials(testimonials[activeLocale] || [])
  }, [activeLocale, testimonials])

  const handleCreate = async (data: Partial<Testimonial>) => {
    try {
      await createTestimonial(data, activeLocale)
      setIsCreating(false)
    } catch (error) {
      logger.log('Failed to create testimonial:', error)
    }
  }

  const handleUpdate = async (data: Partial<Testimonial>) => {
    if (!editingTestimonial) return
    try {
      await updateTestimonial(editingTestimonial.id, data, activeLocale)
      setEditingTestimonial(null)
    } catch (error) {
      logger.log('Failed to update testimonial:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id, activeLocale)
      } catch (error) {
        logger.log('Failed to delete testimonial:', error)
      }
    }
  }

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(orderedTestimonials)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setOrderedTestimonials(items)

    const orders = items.map((testimonial, index) => ({
      id: testimonial.id,
      order: index,
    }))
    try {
      await updateTestimonialOrder(orders, activeLocale)
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
          Add Testimonial
        </button>
      </div>

      {(isCreating || editingTestimonial) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white   p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900 mb-8">
              {editingTestimonial ? 'Edit Testimonial' : 'New Testimonial'}
            </h3>
            <TestimonialForm
              testimonial={editingTestimonial ?? undefined}
              locale={activeLocale}
              onSubmit={editingTestimonial ? handleUpdate : handleCreate}
              onCancel={() => {
                setEditingTestimonial(null)
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
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="testimonials">
              {(provided) => (
                <tbody
                  className="divide-y divide-gray-200"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {orderedTestimonials.map((testimonial, index) => (
                    <Draggable
                      key={testimonial.id}
                      draggableId={testimonial.id}
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
                              {testimonial.author}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {testimonial.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {testimonial.company}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {testimonial.quote}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <button
                              onClick={() => setEditingTestimonial(testimonial)}
                              className="text-primary hover:text-primary/90 disabled:opacity-50"
                              disabled={loading}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(testimonial.id)}
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