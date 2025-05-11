'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { App } from '@/domain/models/models'; // Assuming App model is defined

// AppCard component
const AppCard = ({ app }: { app: App }) => {
  return (
    <Link href={`/apps/${app.id}`} passHref> {/* Add link to app detail page */}
      <div className="border p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow"> {/* Add cursor and hover effect */}
        {app.thumbnail_url && (
          <img src={app.thumbnail_url} alt={`Thumbnail for ${app.name}`} className="w-full h-40 object-cover rounded-md mb-4" /> // Display thumbnail
        )}
        <h3 className="text-lg font-semibold">{app.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{app.description}</p>
        <p className="text-sm text-gray-700">Rating: {app.average_rating ? app.average_rating.toFixed(1) : 'N/A'}</p>
      </div>
    </Link>
  );
};


const PublicAppsPage = () => {
  const [apps, setApps] = useState<App[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [sortBy, setSortBy] = useState('name_asc'); // State for sorting


  useEffect(() => {
    const fetchApps = async () => {
      try {
        setPageLoading(true);
        setError(null);
        // Include search term and sort by in the API request
        const response = await fetch(`/api/apps?searchTerm=${encodeURIComponent(searchTerm)}&sortBy=${encodeURIComponent(sortBy)}`);
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
  }, [searchTerm, sortBy]); // Refetch when search term or sort by changes

  if (pageLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Apps</h1>

      {/* Filtering and Sorting Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Filtering Control */}
        <div className="flex-grow">
          <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search by Name</label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            placeholder="Enter app name"
          />
        </div>

        {/* Sorting Control */}
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="average_rating_desc">Rating (High to Low)</option>
            <option value="average_rating_asc">Rating (Low to High)</option>
            {/* Add other sorting options as needed */}
          </select>
        </div>
      </div>


      {/* TODO: Implement pagination */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.length === 0 ? (
          <p>No apps found.</p>
        ) : (
          apps.map(app => (
            <AppCard key={app.id} app={app} />
          ))
        )}
      </div>
    </div>
  );
};

export default PublicAppsPage;
