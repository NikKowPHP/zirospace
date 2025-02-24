'use client'

import { useState, useEffect } from 'react';
import { Banner } from '@/domain/models/banner.model';
import { Modal } from '@/components/ui/modal/modal';
import { Input } from '@/components/ui/input/input';
import { Textarea } from '@/components/ui/textarea/textarea';
import { Button } from '@/components/ui/button/button';
import { Label } from '@/components/ui/label/label';
import { Switch } from '@/components/ui/switch/switch';
import Image from 'next/image';

interface BannerModalProps {
  banner?: Banner | null;
}

export const BannerModal = ({ banner }: BannerModalProps) => {
  const [showModal, setShowModal] = useState(true);

  // useEffect(() => {
  //   const dismissed = localStorage.getItem('bannerModalDismissed');
  //   if (dismissed === 'true') {
  //     setShowModal(false);
  //   }
  // }, []);

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
      // setShowModal(false);
    }



  const handleClose = () => {
    localStorage.setItem('bannerModalDismissed', 'true');
    setShowModal(false);
    onClose();
  };

  if (!showModal) {
    return null;
  }

  return (
    <Modal isOpen={showModal} onClose={onClose} title="Banner Details">
      <div>
        <h1>{banner?.title}</h1>
        <Image src={banner?.imageUrl || ''} alt={banner?.title || ''} width={100} height={100} />
        <p>{banner?.content}</p>
        <Button onClick={handleClose}>Close</Button>
      </div>
    </Modal>
  );
};
