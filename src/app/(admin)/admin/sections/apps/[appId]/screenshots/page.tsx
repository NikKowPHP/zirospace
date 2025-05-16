'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context'; // Assuming useAuth is the correct hook for client-side auth status
import { App, Screenshot } from '@/domain/models/models'; // Assuming App and Screenshot models are defined
import { Modal } from '@/components/ui/modal/modal'; // Assuming a Modal component exists
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'; // Import drag and drop components
import toast from 'react-hot-toast'; // Import toast for notifications


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
  const [editErrors, setEditErrors] = useState<{ screen_name?: string, route_path?: string, description?: string }>({});


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [screenshotToDelete, setScreenshotToDelete] = useState<Screenshot | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isReordering, setIsReordering] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<{ file: File, preview: string, metadata: { screen_name: string, route_path: string, description: string } }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState<{ [key: number]: { screen_name?: string, route_path?: string, description?: string } }>({});


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
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
          setError(errorMessage);
          toast.error(errorMessage); // Display error toast
        } finally {
          setPageLoading(false);
        }
      };

      fetchData();
    }
  }, [user, appId]); // Refetch when user or appId changes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setUploadErrors({}); // Clear previous upload errors

      const previews = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        metadata: { screen_name: '', route_path: '', description: '' },
      }));
      setFilePreviews(previews);
    }
  };

  const handleMetadataChange = (index: number, field: 'screen_name' | 'route_path' | 'description', value: string) => {
    setFilePreviews(prevPreviews => {
      const newPreviews = [...prevPreviews];
      newPreviews[index].metadata[field] = value;
      return newPreviews;
    });
    // Clear specific field error when user starts typing
    setUploadErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (newErrors[index] && newErrors[index][field]) {
        delete newErrors[index][field];
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index];
        }
      }
      return newErrors;
    });
  };

  const handleUploadScreenshots = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload.');
      return;
    }

    // Basic validation before upload
    const errors: { [key: number]: { screen_name?: string, route_path?: string, description?: string } } = {};
    filePreviews.forEach((item, index) => {
      if (!item.metadata.screen_name.trim()) {
        errors[index] = { ...errors[index], screen_name: 'Screen name cannot be empty.' };
      }
      if (item.metadata.route_path && !item.metadata.route_path.startsWith('/')) {
        errors[index] = { ...errors[index], route_path: 'Route path must start with a "/".' };
      }
    });

    if (Object.keys(errors).length > 0) {
      setUploadErrors(errors);
      toast.error('Please fill in all required metadata fields.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null); // Clear main error

    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append('files', file);
      formData.append('screen_name', filePreviews[index].metadata.screen_name.trim());
      formData.append('route_path', filePreviews[index].metadata.route_path.trim());
      formData.append('description', filePreviews[index].metadata.description.trim());
      formData.append('order_index', (screenshots.length + index).toString()); // Simple ordering for new uploads
    });

    try {
      // Using fetch directly to the new POST endpoint
      const response = await fetch(`/api/apps/${appId}/screenshots`, {
        method: 'POST',
        body: formData,
        // No 'Content-Type' header needed for FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error uploading screenshots: ${errorData.error || response.statusText}`);
      }

      const uploaded: Screenshot[] = await response.json();
      setScreenshots([...screenshots, ...uploaded]); // Add new screenshots to the list
      setSelectedFiles([]); // Clear selected files
      setFilePreviews([]); // Clear previews
      setUploadErrors({}); // Clear upload errors on success
      toast.success(`${uploaded.length} screenshot(s) uploaded successfully!`); // Display success toast

    } catch (err) {
      console.error('Error uploading screenshots:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload screenshots';
      setError(errorMessage); // Set main error for API issues
      toast.error(errorMessage); // Display error toast
    } finally {
      setIsUploading(false);
      setUploadProgress(0); // Reset progress
    }
  };


  const openEditModal = (screenshot: Screenshot) => {
    setCurrentScreenshot(screenshot);
    setEditScreenName(screenshot.screen_name || '');
    setEditRoutePath(screenshot.route_path || '');
    setEditDescription(screenshot.description || '');
    setIsEditModalOpen(true);
    setError(null); // Clear main error
    setEditErrors({}); // Clear previous edit errors
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentScreenshot(null);
    setEditScreenName('');
    setEditRoutePath('');
    setEditDescription('');
    setError(null); // Clear main error
    setEditErrors({}); // Clear edit errors
  };

  const handleSaveScreenshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear main error
    setEditErrors({}); // Clear previous edit errors

    if (!currentScreenshot) {
      const errorMessage = 'No screenshot selected for editing.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    // Basic validation before saving
    const errors: { screen_name?: string, route_path?: string, description?: string } = {};
    if (!editScreenName.trim()) {
      errors.screen_name = 'Screen name cannot be empty.';
    }
    if (editRoutePath && !editRoutePath.startsWith('/')) {
      errors.route_path = 'Route path must start with a "/".';
    }

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      toast.error('Please fill in all required fields.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/screenshots/${currentScreenshot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          screen_name: editScreenName.trim(),
          route_path: editRoutePath.trim(),
          description: editDescription.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Error updating screenshot: ${response.statusText}`);
      }

      const updatedScreenshot: Screenshot = await response.json();
      // Update the screenshot in the list
      setScreenshots(screenshots.map(s => (s.id === updatedScreenshot.id ? updatedScreenshot : s)));
      closeEditModal(); // Close modal on success
      toast.success('Screenshot updated successfully!'); // Display success toast
    } catch (err) {
      console.error('Error saving screenshot:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save screenshot';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteModal = (screenshot: Screenshot) => {
    setScreenshotToDelete(screenshot);
    setIsDeleteModalOpen(true);
    setError(null); // Clear previous errors when opening modal
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
      toast.success('Screenshot deleted successfully!'); // Display success toast
    } catch (err) {
      console.error('Error deleting screenshot:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete screenshot';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
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
      toast.success('Screenshot order saved successfully!'); // Display success toast

    } catch (err) {
      console.error('Error saving screenshot order:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save screenshot order';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
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

  // Correctly use the state variable currentScreenshot
  // const currentScreenshot = screenshots[currentScreenshotIndex]; // Remove this line


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Screenshots for &quot;{app.name}&quot;</h1>

      {/* Upload New Screenshots Section */}
      <div className="mb-8 p-6 border rounded-md shadow-sm bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Upload New Screenshots</h2>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />

        {filePreviews.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-3">Selected Files:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filePreviews.map((item, index) => (
                <div key={index} className="border rounded-md p-4 bg-white shadow-sm">
                  <Image src={item.preview} alt={`Preview "${index}"`} width={150} height={100} objectFit="contain" className="mb-3 rounded" />
                  <p className="text-sm font-medium text-gray-700 truncate">{item.file.name}</p>
                  <div className="mt-2">
                    <label htmlFor={`screenName-${index}`} className="block text-sm font-medium text-gray-700">Screen Name</label>
                    <input
                      type="text"
                      id={`screenName-${index}`}
                      value={item.metadata.screen_name}
                      onChange={(e) => handleMetadataChange(index, 'screen_name', e.target.value)}
                      className={`mt-1 block w-full border ${uploadErrors[index]?.screen_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-1 text-sm`}
                    />
                    {uploadErrors[index]?.screen_name && <p className="text-red-500 text-sm mt-1">{uploadErrors[index]?.screen_name}</p>}
                  </div>
                  <div className="mt-2">
                    <label htmlFor={`routePath-${index}`} className="block text-sm font-medium text-gray-700">Route Path</label>
                    <input
                      type="text"
                      id={`routePath-${index}`}
                      value={item.metadata.route_path}
                      onChange={(e) => handleMetadataChange(index, 'route_path', e.target.value)}
                      className={`mt-1 block w-full border ${uploadErrors[index]?.route_path ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-1 text-sm`}
                    />
                    {uploadErrors[index]?.route_path && <p className="text-red-500 text-sm mt-1">{uploadErrors[index]?.route_path}</p>}
                  </div>
                  <div className="mt-2">
                    <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      id={`description-${index}`}
                      value={item.metadata.description}
                      onChange={(e) => handleMetadataChange(index, 'description', e.target.value)}
                      rows={2}
                      className={`mt-1 block w-full border ${uploadErrors[index]?.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-1 text-sm`}
                    ></textarea>
                    {uploadErrors[index]?.description && <p className="text-red-500 text-sm mt-1">{uploadErrors[index]?.description}</p>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right">
              <button
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUploadScreenshots}
                disabled={isUploading || selectedFiles.length === 0}
              >
                {isUploading ? `Uploading... (${uploadProgress}%)` : `Upload ${selectedFiles.length} File(s)`}
              </button>
            </div>
          </div>
        )}
      </div>


      <div>
        <h2 className="text-xl font-semibold mb-4">Existing Screenshots</h2>
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
                          <Image src={screenshot.image_url} alt={'Screenshot ' + screenshot.id} width={100} height={100} />
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
        {error && isEditModalOpen && <div className="text-red-600 mb-4">{error}</div>} {/* Display main API error */}
        <form onSubmit={handleSaveScreenshot}>
          <div className="mb-4">
            <label htmlFor="editScreenName" className="block text-sm font-medium text-gray-700">Screen Name</label>
            <input
              type="text"
              id="editScreenName"
              value={editScreenName}
              onChange={(e) => {
                setEditScreenName(e.target.value);
                setEditErrors(prevErrors => ({ ...prevErrors, screen_name: undefined })); // Clear specific error on input change
              }}
              className={`mt-1 block w-full border ${editErrors.screen_name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            />
            {editErrors.screen_name && <p className="text-red-500 text-sm mt-1">{editErrors.screen_name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="editRoutePath" className="block text-sm font-medium text-gray-700">Route Path</label>
            <input
              type="text"
              id="editRoutePath"
              value={editRoutePath}
              onChange={(e) => {
                setEditRoutePath(e.target.value);
                setEditErrors(prevErrors => ({ ...prevErrors, route_path: undefined })); // Clear specific error on input change
              }}
              className={`mt-1 block w-full border ${editErrors.route_path ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            />
            {editErrors.route_path && <p className="text-red-500 text-sm mt-1">{editErrors.route_path}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="editDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="editDescription"
              value={editDescription}
              onChange={(e) => {
                setEditDescription(e.target.value);
                setEditErrors(prevErrors => ({ ...prevErrors, description: undefined })); // Clear specific error on input change
              }}
              rows={3}
              className={`mt-1 block w-full border ${editErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm p-2`}
            ></textarea>
            {editErrors.description && <p className="text-red-500 text-sm mt-1">{editErrors.description}</p>}
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
