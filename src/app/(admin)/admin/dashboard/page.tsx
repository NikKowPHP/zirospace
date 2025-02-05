'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button/button"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-medium tracking-[-0.02em] text-gray-900">
          Admin Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/admin/case-studies"
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

        {/* Add more admin sections here as needed */}
      </div>
    </div>
  )
} 