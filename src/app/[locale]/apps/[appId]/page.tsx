'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { App, Screenshot } from '@/domain/models/models'; // Assuming App and Screenshot models are defined
// import { useAuth } from '@/contexts/auth-context'; // Uncomment if client-side auth status is needed

// Basic StarRatingInput component (will be refined in Phase 4)
const StarRatingInput = ({ rating, onRatingChange, disabled }: { rating: number | null, onRatingChange: (rating: number) => void, disabled?: boolean }) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            (hoveredRating || rating || 0) >= star ? 'text-yellow-500' : 'text-gray-300'
          } ${disabled ? 'cursor-not-allowed' : ''}`}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          onMouseEnter={() => !disabled && setHoveredRating(star)}
          onMouseLeave={() => !disabled && setHoveredRating(null)}
          onClick={() => !disabled && onRatingChange(star)}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.695h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 o00.951-.695l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};


const PublicAppDetailPage = () => {
  const params = useParams();
  const appId = params.appId as string; // Get appId from the URL

  const [app, setApp] = useState<App | null>(null);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0); // State to track current screenshot in gallery

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
          setError(err instanceof Error ? err.message : 'Failed to fetch data');
        } finally {
          setPageLoading(false);
        }
      };

      fetchData();
    }
  }, [appId]); // Refetch when appId changes

  useEffect(() => {
    // Update current screenshot rating when current screenshot changes
    if (screenshots.length > 0) {
      setCurrentScreenshotRating(screenshots[currentScreenshotIndex]?.average_rating || null);
    }
  }, [currentScreenshotIndex, screenshots]);


  const handlePreviousScreenshot = () => {
    setCurrentScreenshotIndex((prevIndex) => (prevIndex === 0 ? screenshots.length - 1 : prevIndex - 1));
  };

  const handleNextScreenshot = () => {
    setCurrentScreenshotIndex((prevIndex) => (prevIndex === screenshots.length - 1 ? 0 : prevIndex + 1));
  };

  const handleScreenshotRatingChange = async (rating: number) => {
    if (!screenshots[currentScreenshotIndex]) return;

    setIsSubmittingScreenshotRating(true);
    setError(null); // Clear previous errors

    try {
      const screenshotId = screenshots[currentScreenshotIndex].id;
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

    } catch (err) {
      console.error('Error submitting screenshot rating:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit screenshot rating');
    } finally {
      setIsSubmittingScreenshotRating(false);
    }
  };

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

    } catch (err) {
      console.error('Error submitting app rating:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit app rating');
    } finally {
      setIsSubmittingAppRating(false);
    }
  };


  if (pageLoading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Error state
  }

  if (!app) {
    return <div>App not found.</div>; // Handle case where app is not found
  }

  const currentScreenshot = screenshots[currentScreenshotIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{app.name}</h1>
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
          <div className="relative">
            <img
              src={currentScreenshot?.image_url}
              alt={`Screenshot "${currentScreenshot?.id}"`}
              className="w-full h-96 object-contain"
            />
            {screenshots.length > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                  onClick={handlePreviousScreenshot}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
                  onClick={handleNextScreenshot}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {currentScreenshot && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Screenshot Details</h3>
              <p>Screen Name: {currentScreenshot.screen_name || 'N/A'}</p>
              <p>Route: {currentScreenshot.route_path || 'N/A'}</p>
              <p>Description: {currentScreenshot.description || 'N/A'}</p>
              <p>Rating: {currentScreenshot.average_rating ? currentScreenshot.average_rating.toFixed(1) : 'N/A'}</p>
              
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
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default PublicAppDetailPage;
