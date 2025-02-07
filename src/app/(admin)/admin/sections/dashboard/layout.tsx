import Image from 'next/image'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-secondary">
      <nav className="fixed top-10 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F7F7F7] bg-opacity-80 backdrop-blur-sm rounded-full">
            <div className="flex justify-between h-[72px] items-center px-6">
              <div className="flex items-center gap-2">
                <Link href="/admin/dashboard">
                  <Image
                    src="/images/ziro.avif"
                    alt="ZIRO Admin"
                    width={95}
                    height={36}
                    className="h-[36px] w-[95px]"
                    priority
                  />
                </Link>
                <span className="text-sm font-medium text-gray-500">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-36 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
} 