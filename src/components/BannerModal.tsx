'use client'

import { useState, useEffect } from 'react'
import { Banner } from '@/domain/models/banner.model'
import { Modal } from '@/components/ui/modal/modal'
import { Button } from '@/components/ui/button/button'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
interface BannerModalProps {
  banner?: Banner | null
}

export const BannerModal = ({ banner }: BannerModalProps) => {
  const [showModal, setShowModal] = useState(false)
  const t = useTranslations('BannerModal')

  useEffect(() => {
    // const dismissed = localStorage.getItem('bannerModalDismissed');
    // if (dismissed === 'true') {
    //   setShowModal(false);
    // } else {
    //   setShowModal(true);
    setShowModal(true)
    // }
  }, [])

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
    // localStorage.setItem('bannerModalDismissed', 'true');
    setShowModal(false)
  }

  const handleClose = () => {
    window.location.href = 'https://calendly.com/ziro-nikhil/30min'
    onClose()
  }

  if (!showModal) {
    return null
  }

  return (
    <Modal isOpen={showModal} onClose={onClose}>
      <div className="flex flex-col gap-[16px] w-full items-center justify-center">
        <div className="rounded-lg w-full">
          <Image
            src={banner?.imageUrl || ''}
            alt={banner?.title || ''}
            width={1000}
            height={1000}
            quality={100}
            unoptimized
            className="w-full h-auto rounded-lg aspect-[6/4] sm:aspect-[16/9] object-cover"
          />
        </div>
        <div className="flex flex-col gap-[16px] max-w-[90%] justify-center ">
          <h1 className="text-[24px] leading-[32px] font-semibold">
            {banner?.title}
          </h1>

          <p className="text-[14px] leading-[20px] font-normal ">
            {banner?.content}
          </p>

          {/* <div className="flex items-center justify-center border border-purple-500 w-full"> */}
            <Button
              onClick={handleClose}
              variant="primary"
              size="full"
            >
              {t('bookCall')}
            </Button>
          {/* </div> */}
        </div>
      </div>
    </Modal>
  )
}
