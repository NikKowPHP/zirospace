'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context'; // Assuming useAuth is the correct hook for client-side auth status
import { App } from '@/domain/models/models'; // Assuming App model is defined here or similar location
import { Modal } from '@/components/ui/modal/modal'; // Assuming a Modal component exists
import toast from 'react-hot-toast'; // Import toast for notifications


const AdminAppsPage = () => {
  const { user, loading } = useAuth(); // Use the auth hook to check user status
  const router = useRouter();
  const [apps, setApps] = useState<App[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentApp, setCurrentApp] = useState<App | null>(null);
  const [editAppName, setEditAppName] = useState('');
  const [editAppDescription, setEditAppDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<App | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  useEffect(() => {
    // Redirect if not authenticated and loading is complete
    if (!loading && !user) {
      router.push('/admin/login'); // Redirect to login page
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch apps when user is authenticated
    if (user) {
      const fetchApps = async () => {
        try {
          setPageLoading(true);
          setError(null);
          const response = await fetch('/api/apps'); // Fetch apps from the API
          if (!response.ok) {
            throw new Error(`Error fetching apps: ${response.statusText}`);
          }
          const data: App[] = await response.json();
          setApps(data);
        } catch (err) {
          console.error('Error fetching apps:', err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch apps';
          setError(errorMessage);
          toast.error(errorMessage); // Display error toast
        } finally {
          setPageLoading(false);
        }
      };

      fetchApps();
    }
  }, [user]); // Refetch when user status changes (e.e., logs in)

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!newAppName.trim()) {
      const errorMessage = 'App name cannot be empty.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newAppName.trim(), description: newAppDescription.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Error creating app: ${response.statusText}`);
      }

      const newApp: App = await response.json();
      setApps([...apps, newApp]); // Add the new app to the list
      setNewAppName('');
      setNewAppDescription('');
      toast.success('App created successfully!'); // Display success toast
    } catch (err) {
      console.error('Error creating app:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create app';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
    } finally {
      setIsCreating(false);
    }
  };

  const openEditModal = (app: App) => {
    setCurrentApp(app);
    setEditAppName(app.name);
    setEditAppDescription(app.description || '');
    setIsEditModalOpen(true);
    setError(null); // Clear previous errors when opening modal
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentApp(null);
    setEditAppName('');
    setEditAppDescription('');
    setError(null); // Clear error when closing modal
  };

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!currentApp) {
      const errorMessage = 'No app selected for editing.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    if (!editAppName.trim()) {
      const errorMessage = 'App name cannot be empty.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/apps/${currentApp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editAppName.trim(), description: editAppDescription.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Error updating app: ${response.statusText}`);
      }

      const updatedApp: App = await response.json();
      // Update the app in the list
      setApps(apps.map(app => (app.id === updatedApp.id ? updatedApp : app)));
      closeEditModal(); // Close modal on success
      toast.success('App updated successfully!'); // Display success toast
    } catch (err) {
      console.error('Error saving app:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save app';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (app: App) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
    setError(null); // Clear previous errors when opening modal
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAppToDelete(null);
    setError(null); // Clear error when closing modal
  };

  const handleDeleteApp = async () => {
    if (!appToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/apps/${appToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting app: ${response.statusText}`);
      }

      // Remove the deleted app from the list
      setApps(apps.filter(app => app.id !== appToDelete.id));
      closeDeleteModal(); // Close modal on success
      toast.success('App deleted successfully!'); // Display success toast
    } catch (err) {
      console.error('Error deleting app:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete app';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading || (user && pageLoading)) {
    return <div>Loading...</div>; // Loading state
  }

  if (error && !isEditModalOpen && !isDeleteModalOpen) { // Display main error only if no modals are open
    return <div>Error: {error}</div>; // Error state
  }

  if (!user) {
    return null; // Should be redirected by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Apps</h1>

      <div className="mb-8 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create New App</h2>
        <form onSubmit={handleCreateApp}>
          <div className="mb-4">
            <label htmlFor="appName" className="block text-sm font-medium text-gray-700">App Name</label>
            <input
              type="text"
              id="appName"
              value={newAppName}
              onChange={(e) => {
                setNewAppName(e.target.value);
                setError(null); // Clear error on input change
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
            {error && !newAppName.trim() && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Display validation error */}
          </div>
          <div className="mb-4">
            <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="appDescription"
              value={newAppDescription}
              onChange={(e) => {
                setNewAppDescription(e.target.value);
                setError(null); // Clear error on input change
              }}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
          {error && newAppName.trim() && <div className="text-red-600 mb-4">{error}</div>} {/* Display API error */}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create App'}
          </button>
        </form>
      </div>


      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Rating</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apps.map(app => (
              <tr key={app.id}>
                <td className="py-2 px-4 border-b">{app.name}</td>
                <td className="py-2 px-4 border-b">{app.description}</td>
                <td className="py-2 px-4 border-b">{app.average_rating ? app.average_rating.toFixed(1) : 'N/A'}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="mr-2 text-blue-600 hover:underline"
                    onClick={() => openEditModal(app)}
                  >
                    Edit
                  </button>
                  <button
                    className="mr-2 text-red-600 hover:underline"
                    onClick={() => openDeleteModal(app)}
                  >
                    Delete
                  </button>
                  <a href={`/admin/sections/apps/${app.id}/screenshots`} className="text-green-600 hover:underline">
                    Manage Screenshots
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit App Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <h2 className="text-xl font-semibold mb-4">Edit App</h2>
        {error && isEditModalOpen && <div className="text-red-600 mb-4">{error}</div>} {/* Display modal-specific error */}
        <form onSubmit={handleSaveApp}>
          <div className="mb-4">
            <label htmlFor="editAppName" className="block text-sm font-medium text-gray-700">App Name</label>
            <input
              type="text"
              id="editAppName"
              value={editAppName}
              onChange={(e) => {
                setEditAppName(e.target.value);
                setError(null); // Clear error on input change
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
            {error && isEditModalOpen && !editAppName.trim() && <p className="text-red-500 text-sm mt-1">{error}</p>} {/* Display validation error */}
          </div>
          <div className="mb-4">
            <label htmlFor="editAppDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="editAppDescription"
              value={editAppDescription}
              onChange={(e) => {
                setEditAppDescription(e.target.value);
                setError(null); // Clear error on input change
              }}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
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
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete App Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        {error && isDeleteModalOpen && <div className="text-red-600 mb-4">{error}</div>} {/* Display modal-specific error */}
        <p>Are you sure you want to delete the app &#39;{appToDelete?.name}&#39;? This action cannot be undone.</p>
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
            onClick={handleDeleteApp}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAppsPage;
