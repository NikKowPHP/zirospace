import React from 'react'

const Loading = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Updates</h1>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="mb-4 animate-pulse">
          <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/2 mb-2"></div>
          <div className="h-40 bg-gray-300 rounded-md"></div>
        </div>
      ))}
    </div>
  )
}

export default Loading
