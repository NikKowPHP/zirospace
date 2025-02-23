'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button/button"
// import { AnalyticsDashboard } from "@/components/analytics/analyticsDashboard"

export default function AdminDashboard() {
  const handleRevalidate = async () => {
    const response = await fetch('/api/admin/revalidate')
    if (response.ok) {
      console.log('Cache revalidated')
    } else {
      console.error('Failed to revalidate cache')
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900">
          Admin Dashboard
        </h1>
        <Button variant="primary" onClick={handleRevalidate}>
          Revalidate Cache
        </Button>
      </div>

      {/* Analytics Dashboard */}
      {/* <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">Analytics Overview</h2>
        <AnalyticsDashboard />
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/sections/case-studies"
          className="flex flex-col p-6 bg-white rounded-primary hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Case Studies
          </h2>
          <p className="text-gray-600 mb-4">
            Manage your case studies, add new ones, or edit existing ones.
          </p>
          <Button variant="primary" className="mt-auto w-full sm:w-auto">
            Manage Case Studies
          </Button>
        </Link>

        <Link
          href="/admin/sections/case-study-sliders"
          className="flex flex-col p-6 bg-white rounded-primary hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Case Study Sliders
          </h2>
          <p className="text-gray-600 mb-4">
            Manage case study sliders, add new ones, or edit existing ones.
          </p>
          <Button variant="primary" className="mt-auto w-full sm:w-auto">
            Manage Case Study Sliders
          </Button>
        </Link>

        <Link
          href="/admin/sections/testimonials"
          className="flex flex-col p-6 bg-white rounded-primary hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Testimonials
          </h2>
          <p className="text-gray-600 mb-4">
            Manage testimonials, add new ones, or edit existing ones.
          </p>
          <Button variant="primary" className="mt-auto w-full sm:w-auto">
            Manage Testimonials
          </Button>
        </Link>

        <Link
          href="/admin/sections/blog-posts"
          className="flex flex-col p-6 bg-white rounded-primary hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Blog Posts
          </h2>
          <p className="text-gray-600 mb-4">
            Manage your blog posts, add new ones, or edit existing ones.
          </p>
          <Button variant="primary" className="mt-auto w-full sm:w-auto">
            Manage Blog Posts
          </Button>
        </Link>

        <Link
          href="/admin/sections/banners"
          className="flex flex-col p-6 bg-white rounded-primary hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-medium text-gray-900 mb-2">
            Banners
          </h2>
          <p className="text-gray-600 mb-4">
            Manage your banners, add new ones, or edit existing ones.
          </p>
          <Button variant="primary" className="mt-auto w-full sm:w-auto">
            Manage Banners
          </Button>
        </Link>

        {/* Add more admin sections here as needed */}
      </div>
    </div>
  )
} 