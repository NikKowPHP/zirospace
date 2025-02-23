export interface BannerDTO {
    id: string;
    title: string;
    content: string;
    subtitle: string;
    start_date?: string; // Dates are strings in DTOs
    end_date?: string;   // Dates are strings in DTOs
    is_active: boolean;
    created_at: string;  // Dates are strings in DTOs
    updated_at: string;  // Dates are strings in DTOs
} 


