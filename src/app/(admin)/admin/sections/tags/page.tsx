'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Tag } from '@/domain/models/models';
import { Modal } from '@/components/ui/modal/modal';
import toast from 'react-hot-toast';

const AdminTagsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tags, setTags] = useState<Tag[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);
  const [editTagName, setEditTagName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchTags = async () => {
        try {
          setPageLoading(true);
          setError(null);
          const response = await fetch('/api/tags');
          if (!response.ok) {
            throw new Error(`Error fetching tags: ${response.statusText}`);
          }
          const data: Tag[] = await response.json();
          setTags(data);
        } catch (err) {
          console.error('Error fetching tags:', err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tags';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setPageLoading(false);
        }
      };

      fetchTags();
    }
  }, [user]);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setNewTagName('');
    setCreateError(null);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewTagName('');
    setCreateError(null);
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!newTagName.trim()) {
      setCreateError('Tag name cannot be empty.');
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newTagName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error creating tag: ${errorData.error || response.statusText}`);
      }

      const newTag: Tag = await response.json();
      setTags([...tags, newTag]);
      closeCreateModal();
      toast.success('Tag created successfully!');
    } catch (err) {
      console.error('Error creating tag:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create tag';
      setCreateError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (tag: Tag) => {
    setCurrentTag(tag);
    setEditTagName(tag.name);
    setIsEditModalOpen(true);
    setEditError(null);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentTag(null);
    setEditTagName('');
    setEditError(null);
  };

  const handleSaveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);

    if (!currentTag) {
      setEditError('No tag selected for editing.');
      toast.error('No tag selected for editing.');
      return;
    }

    if (!editTagName.trim()) {
      setEditError('Tag name cannot be empty.');
      toast.error('Tag name cannot be empty.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/tags/${currentTag.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editTagName.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error updating tag: ${errorData.error || response.statusText}`);
      }

      const updatedTag: Tag = await response.json();
      setTags(tags.map(tag => (tag.id === updatedTag.id ? updatedTag : tag)));
      closeEditModal();
      toast.success('Tag updated successfully!');
    } catch (err) {
      console.error('Error saving tag:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save tag';
      setEditError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (tag: Tag) => {
    setTagToDelete(tag);
    setIsDeleteModalOpen(true);
    setError(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTagToDelete(null);
    setError(null);
  };

  const handleDeleteTag = async () => {
    if (!tagToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/tags/${tagToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting tag: ${response.statusText}`);
      }

      setTags(tags.filter(tag => tag.id !== tagToDelete.id));
      closeDeleteModal();
      toast.success('Tag deleted successfully!');
    } catch (err) {
      console.error('Error deleting tag:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete tag';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading || pageLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Tags</h1>

      <div className="mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700"
          onClick={openCreateModal}
        >
          Create New Tag
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id}>
                <td className="py-2 px-4 border-b">{tag.name}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="mr-2 text-blue-600 hover:underline"
                    onClick={() => openEditModal(tag)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => openDeleteModal(tag)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Tag Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <h2 className="text-xl font-semibold mb-4">Create New Tag</h2>
        {createError && <div className="text-red-600 mb-4">{createError}</div>}
        <form onSubmit={handleCreateTag}>
          <div className="mb-4">
            <label htmlFor="newTagName" className="block text-sm font-medium text-gray-700">Tag Name</label>
            <input
              type="text"
              id="newTagName"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-400"
              onClick={closeCreateModal}
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Tag Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <h2 className="text-xl font-semibold mb-4">Edit Tag</h2>
        {editError && <div className="text-red-600 mb-4">{editError}</div>}
        <form onSubmit={handleSaveTag}>
          <div className="mb-4">
            <label htmlFor="editTagName" className="block text-sm font-medium text-gray-700">Tag Name</label>
            <input
              type="text"
              id="editTagName"
              value={editTagName}
              onChange={(e) => setEditTagName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-400"
              onClick={closeEditModal}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Tag Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete the tag &quot;{tagToDelete?.name}&quot;?</p>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-400"
            onClick={closeDeleteModal}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700 disabled:opacity-50"
            onClick={handleDeleteTag}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminTagsPage;
