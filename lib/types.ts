// Villa Type (matches frontend)
export interface Villa {
    id: string;
    name: string;
    description: string;
    price_per_night: number;
    bedrooms: number;
    guests: number;
    image_url: string;
    images?: string[];
    features: string[];
    land_area: number;
    building_area: number;
    levels: number;
    bathrooms: number;
    pantry: number;
    pool_area?: number;
    latitude: number;
    longitude: number;
    amenities_detail?: Record<string, string[]>;
    house_rules?: {
        check_in: string;
        check_out: string;
        quiet_hours: string;
        parties: boolean;
        smoking: boolean;
        pets: boolean;
        max_guests: number;
    };
    proximity_list?: Array<{ name: string; distance: string }>;
    sleeping_arrangements?: Array<{ room: string; bed: string; view: string }>;
    created_at?: string;
}

// Booking Type
export interface Booking {
    id: string;
    villa_id: string;
    villa?: Villa; // Joined
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    guest_name: string;
    guest_email: string;
    guest_whatsapp: string;
    special_request?: string;
    created_at?: string;
}

// Experience/Activity Type
export interface Experience {
    id: string;
    title: string;
    description: string;
    image_url: string;
    created_at?: string;
}

// Blog Post Type
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    image_url: string;
    author: string;
    published_at?: string;
    created_at?: string;
    is_published?: boolean;
}

// Admin User Type
export interface AdminUser {
    id: string;
    email: string;
    role: 'admin' | 'super_admin';
}

// Dashboard Stats
export interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    occupancyRate: number;
    activeGuests: number;
}
