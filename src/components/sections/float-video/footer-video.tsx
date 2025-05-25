// File: src/components/sections/float-video/float-video.tsx
'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import logger from '@/lib/logger'
import { getYoutubeAction } from '@/app/(admin)/admin/sections/youtube/actions/youtubeServerActions'
import { motion, AnimatePresence } from 'framer-motion' // Import Framer Motion

const YouTube = dynamic(
  () => import('react-youtube').then(mod => mod),
  { ssr: false, loading: () => <div className="w-[200px] h-[150px] bg-gray-100 animate-pulse" /> }
)
const isProd = process.env.NODE_ENV === 'production'

declare global {
  interface Window {
    YT: any;
  }
}

export const FooterVideo = () => {
  const [showVideo, setShowVideo] = useState(false)
  const [videoId, setVideoId] = useState('')

  const thumbnailUrl = isProd && videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '/images/case-studies/gsense/gsense.avif'

  useEffect(() => {
    const fetchYoutubeUrl = async () => {
      try {
        const youtubeData = await getYoutubeAction()
        setVideoId(youtubeData?.youtube_url || '')
      } catch (error) {
        logger.error("Failed to fetch YouTube URL:", error)
      }
    }
    fetchYoutubeUrl()
  }, [])

  const opts = {

    height: '100%',
    width: '100%',

    playerVars: {

      autoplay: 1,
      mute: 1,
      controls: 0,
      playlist: videoId,
      loop: 1,
      modestbranding: 1,
      rel: 0
    },
  }

  useEffect(() => {
    const handleLoad = () => {
      setShowVideo(true);
      logger.log('Page fully loaded - starting video');
    };

    if (document.readyState === 'complete' && videoId) {
      handleLoad();
      // No need for event listener cleanup here if we only check readyState once
    } else if (videoId) {
      // Only add listener if videoId is present but document isn't complete yet
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
    return undefined;
  }, [videoId]);

  const videoVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    // AnimatePresence handles the mounting/unmounting animation
    <AnimatePresence>
      <motion.section
        className="  md:hidden flex items-center justify-center  "
        variants={videoVariants}
        initial="hidden"
        animate="visible"
        exit="hidden" // Apply hidden variant on exit
        transition={{ duration: 0.3, ease: "easeInOut" }} // Adjust duration/easing
      >
        <div className="w-full relative pt-[56.25%] rounded-lg overflow-hidden shadow-lg cursor-pointer">
          {!showVideo ? (
            <div
              className="absolute inset-0 w-full"
              onClick={() => setShowVideo(true)}
              role="button"
              aria-label="Play video"
            >
              <Image
                src={thumbnailUrl}
                alt="Video thumbnail"
                fill
                className="object-cover"
                loading="lazy"
                key={thumbnailUrl} // Add key to force re-render if URL changes
                unoptimized={!isProd} // Use optimized images in prod if possible
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity hover:bg-black/20">
                <svg className="w-12 h-12 text-white" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          ) : (
            videoId ? ( // Only render YouTube if videoId is available
              <div className='absolute inset-0'>
                <YouTube
                  videoId={videoId}
                  opts={opts}
                  className="w-full h-full"
                  onReady={(event) => {
                    if (event.target.getPlayerState() !== 1) {
                      event.target.playVideo();
                    }
                  }}
                  onStateChange={(event) => {
                    if (window.YT && event.data === window.YT.PlayerState.UNSTARTED) {
                      event.target.playVideo();
                    }
                  }}
                  onError={(e) => logger.log('YouTube player error:', e)}
                />
              </div>
            ) : (
              <div className="w-[200px] h-[150px] bg-gray-100 animate-pulse flex items-center justify-center text-gray-500">Loading Video...</div>
            )
          )}
        </div>
      </motion.section>
    </AnimatePresence>
  )
}
// --- NEW CODE END ---
