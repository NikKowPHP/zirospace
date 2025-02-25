"use client";

import { BannerModal } from '@/components/BannerModal';
import { usePage } from '@/contexts/page-context';

export const BannerModalWrapper = () => {
  const { activeBanner } = usePage();

 

  return (
    <BannerModal
      banner={activeBanner}
    />
  );
};