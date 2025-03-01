export interface BannerDTO {
    id: string;
    title: string;
    content: string;
    subtitle: string;
    image_url?: string;
    youtube_url?: string;
    start_date?: string; // Dates are strings in DTOs
    end_date?: string;   // Dates are strings in DTOs
    is_active: boolean;
    created_at: string;  // Dates are strings in DTOs
    updated_at: string;  // Dates are strings in DTOs
    cta_button_text?: string;
    cta_button_link?: string;
} 


