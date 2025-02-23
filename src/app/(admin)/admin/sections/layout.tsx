import Image from 'next/image'
import Link from 'next/link'
import { LayoutDashboard, Images, SlidersHorizontal, MessageCircle, FileText, Image as ImageIcon } from 'lucide-react'
import { AdminProvider } from '@/contexts/admin-context'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>

   
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-sm py-8 px-6 fixed top-0 left-0 h-full">
        <Link href="/admin/dashboard" className="flex items-center gap-2 mb-12">
          <Image
            src="/images/ziro.avif"
            alt="ZIRO Admin"
            width={95}
            height={36}
            className="h-[36px] w-[95px]"
            priority
          />
          <span className="text-sm font-medium text-gray-500">Admin</span>
        </Link>

        <nav className="flex flex-col space-y-1">
          <Link 
            href="/admin/sections/dashboard" 
            className="flex items-center gap-3 py-3 px-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          
          <Link 
            href="/admin/sections/case-studies" 
            className="flex items-center gap-3 py-3 px-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Images className="w-5 h-5" />
            <span className="font-medium">Case Studies</span>
          </Link>
          
          <Link 
            href="/admin/sections/case-study-sliders" 
            className="flex items-center gap-3 py-3 px-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Case Study Sliders</span>
          </Link>
          
          <Link 
            href="/admin/sections/testimonials" 
            className="flex items-center gap-3 py-3 px-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">Testimonials</span>
          </Link>

          <Link 
            href="/admin/sections/blog-posts" 
            className="flex items-center gap-3 py-3 px-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Blog Posts</span>
          </Link>

          <Link 
            href="/admin/sections/banners" 
            className="flex items-center gap-3 py-3 px-4 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Banners</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 py-8">
        <div className="max-w-7xl mx-auto px-8">
          {children}
        </div>
      </main>
      </div>
      </AdminProvider>
  )
} 