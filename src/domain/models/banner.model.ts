export interface Banner {
    id: string;
    title: string;
    content: string;
    subtitle?: string;
    imageUrl?: string;
    youtubeUrl?: string;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
    order_index?: number;
    createdAt: Date;
    updatedAt: Date;
    ctaButtonText?: string;
    ctaButtonLink?: string;
  }