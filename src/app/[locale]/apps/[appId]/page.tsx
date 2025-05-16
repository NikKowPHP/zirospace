'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { App, Screenshot } from '@/domain/models/models'; // Assuming App and Screenshot models are defined
// import { useAuth } from '@/contexts/auth-context'; // Uncomment if client-side auth status is needed
import StarRatingInput from '@/components/ui/StarRatingInput'; // Import the reusable StarRatingInput component
import toast from 'react-hot-toast'; // Import toast for notifications
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const SkeletonAppDetail = () => (
  <div className="max-w-5xl mx-auto px-10 py-10 my-[100px] bg-gray-50 rounded-primary-lg animate-pulse">
    <div className="mb-6 h-8 bg-gray-200 rounded w-1/2"></div>
    <div className="mb-4 h-6 bg-gray-200 rounded w-3/4"></div>
    <div className="mb-4 h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="mb-6 h-10 bg-gray-200 rounded w-1/3"></div>
    <div className="mb-8">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="relative">
            <div className="w-full h-[350px] bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
    <div className="mt-8 p-4 bg-gray-200 rounded-lg flex flex-col justify-start items-start max-w-xl">
      <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="mt-4 px-4 py-2 bg-gray-300 text-white rounded-lg w-1/4"></div>
    </div>
  </div>
);

const PublicAppDetailPage = () => {
  const params = useParams();
  const appId = params.appId as string; // Get appId from the URL

  const [app, setApp] = useState<App | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null);
  const [currentScreenshotRating, setCurrentScreenshotRating] = useState<number | null>(null);
  const [isSubmittingScreenshotRating, setIsSubmittingScreenshotRating] = useState(false);

  const [currentAppRating, setCurrentAppRating] = useState<number | null>(null);
  const [isSubmittingAppRating, setIsSubmittingAppRating] = useState(false);


  useEffect(() => {
    // Fetch app details and screenshots when appId is available
    if (appId) {
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
          setCurrentAppRating(appData.average_rating || null); // Set initial app rating

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
  }, [appId]); // Refetch when appId changes

  useEffect(() => {
    // Update current screenshot rating when selected screenshot changes
    if (selectedScreenshot) {
      setCurrentScreenshotRating(selectedScreenshot.average_rating || null);
    } else {
      setCurrentScreenshotRating(null);
    }
  }, [selectedScreenshot]);


  const handleAppRatingChange = async (rating: number) => {
    if (!app) return;

    setIsSubmittingAppRating(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch(`/api/apps/${app.id}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating_value: rating }), // TODO: Add user_id if needed
      });

      if (!response.ok) {
        throw new Error(`Error submitting app rating: ${response.statusText}`);
      }

      // Assuming the API returns the updated average rating or a success message
      // For now, we'll just update the local state with the submitted rating
      // A more robust approach would be to refetch the app or update the average based on API response
      setCurrentAppRating(rating); // Optimistically update UI
      toast.success('App rated successfully!'); // Display success toast

    } catch (err) {
      console.error('Error submitting app rating:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit app rating';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
    } finally {
      setIsSubmittingAppRating(false);
    }
  };

  const handleScreenshotRatingChange = async (rating: number) => {
    if (!selectedScreenshot) return;

    setIsSubmittingScreenshotRating(true);
    setError(null); // Clear previous errors

    try {
      const screenshotId = selectedScreenshot.id;
      const response = await fetch(`/api/screenshots/${screenshotId}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating_value: rating }), // TODO: Add user_id if needed
      });

      if (!response.ok) {
        throw new Error(`Error submitting screenshot rating: ${response.statusText}`);
      }

      // Assuming the API returns the updated average rating or a success message
      // For now, we'll just update the local state with the submitted rating
      // A more robust approach would be to refetch the screenshot or update the average based on API response
      setCurrentScreenshotRating(rating); // Optimistically update UI
      toast.success('Screenshot rated successfully!'); // Display success toast

    } catch (err) {
      console.error('Error submitting screenshot rating:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit screenshot rating';
      setError(errorMessage);
      toast.error(errorMessage); // Display error toast
    } finally {
      setIsSubmittingScreenshotRating(false);
    }
  };


  if (pageLoading) {
    return <SkeletonAppDetail />; // Loading state
  }

  if (error) {
    return <div className="max-w-5xl mx-auto px-10 py-10 my-[100px] bg-gray-50 rounded-primary-lg"><div className="text-red-600">Error: {error}</div></div>; // Error state
  }

  if (!app) {
    return <div>App not found.</div>; // Handle case where app is not found
  }

  return (
    <div className="max-w-5xl mx-auto px-10 py-10 my-[100px] bg-gray-50 rounded-primary-lg">
      <div>
      <Link href="/apps" className="mb-6 inline-flex items-center px-4 py-2  text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
        <ArrowLeft className='w-6 h-6 mr-2'/> Back to Apps
      </Link>
      
      <h1 className="text-2xl font-bold mb-4">{app.name}</h1>
       {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {app.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      <p className="text-gray-700 mb-4">{app.description}</p>
      
      {/* UI for submitting overall app rating */}
      <div className="flex items-center mb-6">
        <span className="mr-2 text-sm font-medium text-gray-700">Rate this app:</span>
        <StarRatingInput
          rating={currentAppRating}
          onRatingChange={handleAppRatingChange}
          disabled={isSubmittingAppRating}
        />
        {isSubmittingAppRating && <span className="ml-2 text-sm text-gray-600">Submitting...</span>}
        <span className="ml-4 text-sm text-gray-700">Overall Rating: {app.average_rating ? app.average_rating.toFixed(1) : 'N/A'}</span>
      </div>


      {screenshots.length === 0 ? (
        <p>No screenshots available for this app.</p>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {screenshots.map((screenshot) => (
              <div key={screenshot.id} className="relative">
                <div
                  className="cursor-pointer"
                  onClick={() => setSelectedScreenshot(screenshot)}
                >
                  <img
                    src={screenshot.image_url}
                    alt={`Screenshot of ${app.name}: ${screenshot.screen_name || screenshot.id}`}
                    className="w-full h-[350px] object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedScreenshot && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg flex flex-col justify-start items-start max-w-xl">
          <h3 className="text-lg font-semibold mb-2">Screenshot Details</h3>
          <p>Screen Name: {selectedScreenshot.screen_name || 'N/A'}</p>
          <p>Route: {selectedScreenshot.route_path || 'N/A'}</p>
          <p>Description: {selectedScreenshot.description || 'N/A'}</p>
          <p>Rating: {selectedScreenshot.average_rating ? selectedScreenshot.average_rating.toFixed(1) : 'N/A'}</p>

          {/* UI for submitting screenshot rating */}
          <div className="flex items-center mt-2">
            <span className="mr-2 text-sm font-medium text-gray-700">Rate this screenshot:</span>
            <StarRatingInput
              rating={currentScreenshotRating}
              onRatingChange={handleScreenshotRatingChange}
              disabled={isSubmittingScreenshotRating}
            />
            {isSubmittingScreenshotRating && <span className="ml-2 text-sm text-gray-600">Submitting...</span>}
          </div>

          {/* Add close button for details */}
          <button
            className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
            onClick={() => setSelectedScreenshot(null)}
          >
            Close Details
          </button>
        </div>
      )}
</div>
    </div>
  );
};

export default PublicAppDetailPage;
