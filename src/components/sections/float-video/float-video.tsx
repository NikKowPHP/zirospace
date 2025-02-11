'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import logger from '@/lib/logger'
const YouTube = dynamic(
  () => import('react-youtube').then(mod => mod),
  { ssr: false, loading: () => <div className="w-[200px] h-[150px] bg-gray-100 animate-pulse" /> }
)
const isProd = process.env.NODE_ENV === 'production'

export const FloatVideo = () => {
  const [showVideo, setShowVideo] = useState(false)
  const videoId = 'vKb9WcH8Qpg'
  const thumbnailUrl = isProd ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '/images/case-studies/gsense/gsense.avif'

  const opts = {
    height: '150',
    width: '200',
    playerVars: {
      mute: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0
    },
  }

  return (
    <section className="fixed bottom-[65px] right-[10px] z-50">
      <div className="w-[200px] h-[150px] rounded-lg overflow-hidden shadow-lg cursor-pointer">
        {!showVideo ? (
          <div 
            className="relative w-full h-full"
            onClick={() => setShowVideo(true)}
            role="button"
            aria-label="Play video"
          >
            <Image
              src={thumbnailUrl}
              alt="Video thumbnail"
              fill
              className="object-cover"
              sizes="200px"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity hover:bg-black/20">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        ) : (
          <YouTube
            videoId={videoId}
            opts={opts}
            className="w-full h-full"
            onError={(e) => logger.log('YouTube player error:', e)}
          />
        )}
      </div>
    </section>
  )
}
