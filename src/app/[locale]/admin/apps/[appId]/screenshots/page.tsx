'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context'; // Assuming useAuth is the correct hook for client-side auth status
import { App, Screenshot } from '@/domain/models/models'; // Assuming App and Screenshot models are defined
import { Modal } from '@/components/ui/modal/modal'; // Assuming a Modal component exists
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'; // Import drag and drop components

const AdminAppScreenshotsPage = () => {
  const { user, loading } = useAuth(); // Use the auth hook to check user status
  const router = useRouter();
  const params = useParams();
  const appId = params.appId as string; // Get appId from the URL

  const [app, setApp] = useState<App | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState<Screenshot | null>(null);
  const [editScreenName, setEditScreenName] = useState('');
  const [editRoutePath, setEditRoutePath] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [screenshotToDelete, setScreenshotToDelete] = useState<Screenshot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isReordering, setIsReordering] = useState(false);


  useEffect(() => {
    // Redirect if not authenticated and loading is complete
    if (!loading && !user) {
      router.push('/admin/login'); // Redirect to login page
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Fetch app details and screenshots when user is authenticated and appId is available
    if (user && appId) {
      const fetchData = async () => {
        try {
          setPageLoading(true);
          setError(null);

          // Fetch app details
          const appResponse = await fetch(`/api/apps/${appId}`);
          if (!appResponse.ok) {
            throw new Error(`Error fetching app details: ${appResponse.statusText}`);
          }
          const appData: App = await appResponse.json();
          setApp(appData);

          // Fetch screenshots for the app
          const screenshotsResponse = await fetch(`/api/apps/${appId}/screenshots`);
          if (!screenshotsResponse.ok) {
            throw new Error(`Error fetching screenshots: ${screenshotsResponse.statusText}`);
          }
          const screenshotsData: Screenshot[] = await screenshotsResponse.json();
          setScreenshots(screenshotsData);

        } catch (err) {
          console.error('Error fetching data:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
          setPageLoading(false);
        }
      };

      fetchData();
    }
  }, [user, appId]); // Refetch when user or appId changes

  const openEditModal = (screenshot: Screenshot) => {
    setCurrentScreenshot(screenshot);
    setEditScreenName(screenshot.screen_name || '');
    setEditRoutePath(screenshot.route_path || '');
    setEditDescription(screenshot.description || '');
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentScreenshot(null);
    setEditScreenName('');
    setEditRoutePath('');
    setEditDescription('');
    setError(null); // Clear error when closing modal
  };

  const handleSaveScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScreenshot) return;

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/screenshots/${currentScreenshot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screen_name: editScreenName,
          route_path: editRoutePath,
          description: editDescription,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating screenshot: ${response.statusText}`);
      }

      const updatedScreenshot: Screenshot = await response.json();
      // Update the screenshot in the list
      setScreenshots(screenshots.map(s => (s.id === updatedScreenshot.id ? updatedScreenshot : s)));
      closeEditModal(); // Close modal on success
    } catch (err) {
      console.error('Error saving screenshot:', err);
      setError(err instanceof Error ? err.message : 'Failed to save screenshot');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (screenshot: Screenshot) => {
    setScreenshotToDelete(screenshot);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setScreenshotToDelete(null);
    setError(null); // Clear error when closing modal
  };

  const handleDeleteScreenshot = async () => {
    if (!screenshotToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/screenshots/${screenshotToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error deleting screenshot: ${response.statusText}`);
      }

      // Remove the deleted screenshot from the list
      setScreenshots(screenshots.filter(s => s.id !== screenshotToDelete.id));
      closeDeleteModal(); // Close modal on success
    } catch (err) {
      console.error('Error deleting screenshot:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete screenshot');
    } finally {
      setIsDeleting(false);
    }
  };

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorderedScreenshots = Array.from(screenshots);
    const [removed] = reorderedScreenshots.splice(result.source.index, 1);
    reorderedScreenshots.splice(result.destination.index, 0, removed);

    setScreenshots(reorderedScreenshots);
  };

  const handleSaveOrder = async () => {
    setIsReordering(true);
    setError(null);

    try {
      const screenshotIdsInOrder = screenshots.map(s => s.id);
      const response = await fetch(`/api/apps/${appId}/screenshots/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(screenshotIdsInOrder),
      });

      if (!response.ok) {
        throw new Error(`Error reordering screenshots: ${response.statusText}`);
      }

      // Optionally refetch screenshots to get updated order_index from backend
      // Or rely on the state update from onDragEnd
      // For now, relying on state update

    } catch (err) {
      console.error('Error saving screenshot order:', err);
      setError(err instanceof Error ? err.message : 'Failed to save screenshot order');
    } finally {
      setIsReordering(false);
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

  if (!app) {
    return <div>App not found.</div>; // Handle case where app is not found
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Screenshots for "{app.name}"</h1>

      {/* TODO: Add UI for uploading new screenshots */}

      <div>
        <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
        {screenshots.length === 0 ? (
          <p>No screenshots found for this app.</p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="screenshots">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {screenshots.map((screenshot, index) => (
                    <Draggable key={screenshot.id} draggableId={screenshot.id.toString()} index={index}>
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="border p-4 mb-2 bg-white rounded shadow"
                        >
                          <img src={screenshot.image_url} alt={`Screenshot "${screenshot.id}"`} width={100} />
                          <p>Screen Name: {screenshot.screen_name}</p>
                          <p>Route: {screenshot.route_path}</p>
                          <p>Description: {screenshot.description}</p>
                          <p>Order: {screenshot.order_index}</p>
                          <p>Rating: {screenshot.average_rating ? screenshot.average_rating.toFixed(1) : 'N/A'}</p>
                          <button
                            className="mr-2 text-blue-600 hover:underline"
                            onClick={() => openEditModal(screenshot)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:underline"
                            onClick={() => openDeleteModal(screenshot)}
                          >
                            Delete
                          </button>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {screenshots.length > 0 && (
        <div className="mt-4 text-right">
          <button
            className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 disabled:opacity-50"
            onClick={handleSaveOrder}
            disabled={isReordering}
          >
            {isReordering ? 'Saving Order...' : 'Save Order'}
          </button>
        </div>
      )}


      {/* Edit Screenshot Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <h2 className="text-xl font-semibold mb-4">Edit Screenshot</h2>
        {error && isEditModalOpen && <div className="text-red-600 mb-4">{error}</div>} {/* Display modal-specific error */}
        <form onSubmit={handleSaveScreenshot}>
          <div className="mb-4">
            <label htmlFor="editScreenName" className="block text-sm font-medium text-gray-700">Screen Name</label>
            <input
              type="text"
              id="editScreenName"
              value={editScreenName}
              onChange={(e) => setEditScreenName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editRoutePath" className="block text-sm font-medium text-gray-700">Route Path</label>
            <input
              type="text"
              id="editRoutePath"
              value={editRoutePath}
              onChange={(e) => setEditRoutePath(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="editDescription"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
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

      {/* Delete Screenshot Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        {error && isDeleteModalOpen && <div className="text-red-600 mb-4">{error}</div>} {/* Display modal-specific error */}
        <p>Are you sure you want to delete this screenshot? This action cannot be undone.</p>
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
            onClick={handleDeleteScreenshot}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminAppScreenshotsPage;
