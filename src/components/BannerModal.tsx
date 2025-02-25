'use client'

import { useState, useEffect } from 'react';
import { Banner } from '@/domain/models/banner.model';
import { Modal } from '@/components/ui/modal/modal';
import { Button } from '@/components/ui/button/button';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
interface BannerModalProps {
  banner?: Banner | null;
}

export const BannerModal = ({ banner }: BannerModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations('BannerModal');

  useEffect(() => {
    // const dismissed = localStorage.getItem('bannerModalDismissed');
    // if (dismissed === 'true') {
    //   setShowModal(false);
    // } else {
    //   setShowModal(true);
    setShowModal(true);
    // }
  }, []);

   useEffect(() => {
    console.log('isOpen', showModal);
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);



    const onClose = () => {
      // localStorage.setItem('bannerModalDismissed', 'true');
      setShowModal(false);
    }



  const handleClose = () => {
      window.location.href = 'https://calendly.com/ziro-nikhil/30min';
    onClose();
  };

  if (!showModal) {
    return null;
  }

  return (
    <Modal isOpen={showModal} onClose={onClose} >
      <div className="flex flex-col gap-6 w-full border border-red-500">
        <h1 className='text-2xl font-bold border border-blue-500'>{banner?.title}</h1>
        <div className='border border-green-500'>
          <Image src={banner?.imageUrl || ''} alt={banner?.title || ''} width={600} height={600} quality={100} unoptimized className='w-full h-auto' />
        </div>
        <p className='border border-yellow-500'>{banner?.content}</p>
        <div className='flex items-center justify-between border border-purple-500'>
          <Button size='sm' onClick={handleClose}>{t('close')}</Button>
          <Button  variant='outline' size='sm' onClick={handleClose}>{t('submit')}</Button>

        </div>
      </div>
    </Modal>
  );
};
