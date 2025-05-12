'use client'

import { useEffect, useState, useRef } from 'react' // Import useRef
import Link from 'next/link' // Import Link for navigation
import { App } from '@/domain/models/models' // Assuming App model is defined
import toast from 'react-hot-toast' // Import toast for notifications
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons

// Simple Skeleton Loader Component
const SkeletonCard = () => (
  <div className="p-[20px] rounded-xl bg-gray-200 shadow-sm flex flex-col gap-[16px] animate-pulse">
    <div className="w-full h-40 object-cover rounded-md mb-4 bg-gray-300"></div>
    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
  </div>
);

// AppCard component
const AppCard = ({ app }: { app: App }) => {
  return (
    <Link href={`/apps/${app.id}`} passHref>
      {' '}
      {/* Add link to app detail page */}
      <div
      key={app.id}
      className="p-[20px] rounded-xl  bg-gray-100 shadow-sm flex flex-col gap-[16px] "
    >
        {' '}
        {/* Add cursor and hover effect */}
        {app.thumbnail_url && (
          <img
            src={app.thumbnail_url}
            alt={`Thumbnail for ${app.name}`}
            className="w-full h-40 object-cover rounded-md mb-4"
          /> // Display thumbnail
        )}
        <h3 className="text-lg font-semibold">{app.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{app.description}</p>
        <p className="text-sm text-gray-700">
          Rating: {app.average_rating ? app.average_rating.toFixed(1) : 'N/A'}
        </p>
      </div>
    </Link>
  )
}

const PublicAppsPage = () => {
  const [apps, setApps] = useState<App[]>([])
  const [pageLoading, setPageLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('') // State for search term
  const [sortBy, setSortBy] = useState('name_asc') // State for sorting
  const [currentPage, setCurrentPage] = useState(1) // State for current page
  const [itemsPerPage] = useState(9) // State for items per page (example: 9 apps per page)
  const [totalPages, setTotalPages] = useState(1) // State for total pages (will need to get this from API response headers or body)
  const initialLoad = useRef(true); // Ref to track initial load

  useEffect(() => {
    // Skip debounce on initial load
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const fetchApps = async () => {
        try {
          setPageLoading(true)
          setError(null)
          // Include search term and sort by in the API request
          const response = await fetch(
            `/api/apps?searchTerm=${encodeURIComponent(
              searchTerm
            )}&sortBy=${encodeURIComponent(
              sortBy
            )}&page=${currentPage}&limit=${itemsPerPage}`
          )
          if (!response.ok) {
            throw new Error(`Error fetching apps: ${response.statusText}`)
          }
          const result = await response.json()
          console.log('Fetched apps data:', result) // Log the fetched data
          const { data, total } = result // Destructure data and total from the response body
          setApps(data)
          setTotalPages(Math.ceil(total / itemsPerPage)) // Calculate and set total pages
        } catch (err) {
          console.error('Error fetching apps:', err)
          const errorMessage =
            err instanceof Error ? err.message : 'Failed to fetch apps'
          setError(errorMessage)
          toast.error(errorMessage) // Display error toast
        } finally {
          setPageLoading(false)
        }
      }

      fetchApps()
    }, 1000) // 2000ms debounce delay

    // Cleanup function to clear the timeout
    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, sortBy, currentPage, itemsPerPage]) // Refetch when search term, sort by, or page changes

  // Effect for initial data fetch without debounce
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setPageLoading(true)
        setError(null)
        const response = await fetch(
          `/api/apps?searchTerm=${encodeURIComponent(
            searchTerm
          )}&sortBy=${encodeURIComponent(
            sortBy
          )}&page=${currentPage}&limit=${itemsPerPage}`
        )
        if (!response.ok) {
          throw new Error(`Error fetching apps: ${response.statusText}`)
        }
        const result = await response.json()
        const { data, total } = result
        setApps(data)
        setTotalPages(Math.ceil(total / itemsPerPage))
      } catch (err) {
        console.error('Error fetching apps:', err)
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch apps'
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setPageLoading(false)
      }
    }

    if (initialLoad.current) {
      fetchApps();
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-10 py-10 my-[100px] bg-gray-50 rounded-primary-lg">
      <div>
        <h1 className="text-2xl font-bold mb-6">Apps</h1>

        {/* Filtering and Sorting Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Filtering Control */}
          <div className="flex-grow">
            <label
              htmlFor="searchTerm"
              className="block text-sm font-medium text-gray-700"
            >
              Search by Name
            </label>
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
            <label
              htmlFor="sortBy"
              className="block text-sm font-medium text-gray-700"
            >
              Sort By
            </label>
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

        {error && (
          <div className="text-red-600 mb-4">
            Error: {error} {/* Error state */}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageLoading ? (
            // Display skeleton loaders while loading
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          ) : apps.length === 0 ? (
            <p>No apps found.</p>
          ) : (
            apps.map((app) => <AppCard key={app.id} app={app} />)
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center mt-12">
          <button
            className="p-2 mr-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-400 disabled:opacity-50"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || pageLoading}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 ml-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow hover:bg-gray-400 disabled:opacity-50"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || pageLoading}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default PublicAppsPage
