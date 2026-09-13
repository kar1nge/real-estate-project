export interface TeamMember {
    id: number;
    name: string;
    position: string;
    position_display: string;
    bio: string;
    email: string | null;
    phone: string | null;
    photo: string | null;
    linkedin_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}