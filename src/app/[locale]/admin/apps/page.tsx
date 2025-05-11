'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context'; // Assuming useAuth is the correct hook for client-side auth status
import { App } from '@/domain/models/models'; // Assuming App model is defined here or similar location

const AdminAppsPage = () => {
  const { user, loading } = useAuth(); // Use the auth hook to check user status
  const router = useRouter();
  const [apps, setApps] = useState<App[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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
          setError(err instanceof Error ? err.message : 'Failed to fetch apps');
        } finally {
          setPageLoading(false);
        }
      };

      fetchApps();
    }
  }, [user]); // Refetch when user status changes (e.g., logs in)

  const handleCreateApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName) {
      setError('App name is required.');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newAppName, description: newAppDescription }),
      });

      if (!response.ok) {
        throw new Error(`Error creating app: ${response.statusText}`);
      }

      const newApp: App = await response.json();
      setApps([...apps, newApp]); // Add the new app to the list
      setNewAppName('');
      setNewAppDescription('');
    } catch (err) {
      console.error('Error creating app:', err);
      setError(err instanceof Error ? err.message : 'Failed to create app');
    } finally {
      setIsCreating(false);
    }
  };


  if (loading || (user && pageLoading)) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
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
              onChange={(e) => setNewAppName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="appDescription" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="appDescription"
              value={newAppDescription}
              onChange={(e) => setNewAppDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            ></textarea>
          </div>
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
                  {/* TODO: Implement Edit functionality */}
                  <button className="mr-2 text-blue-600 hover:underline">Edit</button>
                  {/* TODO: Implement Delete functionality */}
                  <button className="mr-2 text-red-600 hover:underline">Delete</button>
                  {/* TODO: Implement Manage Screenshots functionality */}
                  <button className="text-green-600 hover:underline">Manage Screenshots</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppsPage;
