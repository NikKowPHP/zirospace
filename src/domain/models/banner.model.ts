export interface Banner {
    id: string;
    title: string;
    content: string;
    subtitle?: string;
    startDate?: Date;
    endDate?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }