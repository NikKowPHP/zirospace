'use client'

import { useState, useEffect } from 'react'
import { Banner } from '@/domain/models/banner.model'
import { Modal } from '@/components/ui/modal/modal'
import { Button } from '@/components/ui/button/button'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import logger from '@/lib/logger'
import YouTube from 'react-youtube'
interface BannerModalProps {
  banner?: Banner | null
}

export const BannerModal = ({ banner }: BannerModalProps) => {
  const [showModal, setShowModal] = useState(false)
  const t = useTranslations('BannerModal')

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      mute: 0,
      controls: 1,
      playlist: banner?.youtubeUrl,
      loop: 1,
      modestbranding: 1,
      rel: 0,
    },
  
  }

  useEffect(() => {
    if (banner) {
      const dismissed = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
      if (!dismissed.includes(banner.id)) {
        setShowModal(true);
      }
    }
  }, [banner])

  useEffect(() => {
    console.log('isOpen', showModal)
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const onClose = () => {
    handleDismissLocalStorage()
    setShowModal(false);
  }
  const handleDismissLocalStorage = () => {
    if (banner?.id) {
      const dismissed = new Set(JSON.parse(localStorage.getItem('dismissedBanners') || '[]'));
      dismissed.add(banner.id);
      localStorage.setItem('dismissedBanners', JSON.stringify([...dismissed]));
    }
  }
  const handleRedirect = () => {
    window.location.href = 'https://calendly.com/ziro-nikhil/30min'
  }

  const handleClose = () => {
    handleRedirect()
    onClose()
  }

  if (!showModal) {
    return null
  }

  return (
    <Modal isOpen={showModal} onClose={onClose}>
      <div className="flex flex-col gap-[16px] w-full items-center justify-center">
        <div className="rounded-lg w-full">
          {banner?.imageUrl && (
            <Image
              src={banner?.imageUrl || ''}
              alt={banner?.title || ''}
              width={1000}
              height={1000}
              quality={100}
              unoptimized
              className="w-full h-auto rounded-lg aspect-[6/4] sm:aspect-[16/9] object-cover"
            />
          )}

          {banner?.youtubeUrl && (
            <div className="relative pt-[56.25%] w-full">
              <div className="absolute top-0 left-0 w-full h-full rounded-lg overflow-hidden">
                <YouTube
                  videoId={banner?.youtubeUrl}
                  opts={opts}
                  className="w-full h-full"
                  onReady={(event: any) => {
                    if (event.target.getPlayerState() !== 1) {
                      event.target.playVideo()
                    }
                  }}
                  onStateChange={(event: any) => {
                    // Handle any autoplay errors gracefully
                    if (
                      window.YT &&
                      event.data === window.YT.PlayerState.UNSTARTED
                    ) {
                      event.target.playVideo()
                    }
                  }}
                  onError={(e: any) => logger.log('YouTube player error:', e)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[16px] max-w-[90%] justify-center ">
          <h1 className="text-[24px] leading-[32px] font-semibold">
            {banner?.title}
          </h1>

          <p className="text-[14px] leading-[20px] font-normal ">
            {banner?.content}
          </p>

          {/* <div className="flex items-center justify-center border border-purple-500 w-full"> */}
          <Button onClick={handleClose} variant="primary" size="full">
            {t('bookCall')}
          </Button>
          {/* </div> */}
        </div>
      </div>
    </Modal>
  )
}
