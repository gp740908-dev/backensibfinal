// Villa Type (matches database)
export interface Villa {
    id: string;
    name: string;
    description: string;
    price_per_night: number;
    bedrooms: number;
    guests: number;
    image_url: string;
    images?: string[];
    features?: string[];
    land_area: number;
    building_area: number;
    levels: number;
    bathrooms: number;
    pantry: number;
    pool_area?: number;
    latitude: number;
    longitude: number;
    amenities_detail?: Record<string, string[]>;
    house_rules?: Record<string, any>;
    proximity_list?: Array<{ name: string; distance: string }>;
    sleeping_arrangements?: Array<{ room: string; bed: string; view: string }>;
    created_at?: string;
}

// Booking Type
export interface Booking {
    id: string;
    villa_id: string;
    villas?: { name: string }; // Joined
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

// Experience/Activity Type (matches database)
export interface Experience {
    id: string;
    title: string;
    description: string;
    category: string;
    image_url: string;
    price_start_from?: number | null;
    cta_label?: string;
    created_at?: string;
}

// Journal Post Type (actual table name is journal_posts)
export interface JournalPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    category: string;
    image_url: string;
    author: string;
    published_at: string;
    created_at?: string;
}

// Inquiry Type
export interface Inquiry {
    id: string;
    name?: string;
    email?: string;
    whatsapp?: string;
    message?: string;
    type: string;
    status: string;
    villa_name?: string;
    check_in_date?: string;
    check_out_date?: string;
    admin_notes?: string;
    replied_at?: string;
    created_at?: string;
}

// Review Type
export interface Review {
    id: string;
    guest_name: string;
    quote: string;
    source?: string;
    rating: number;
    image_url?: string;
    is_featured: boolean;
    created_at?: string;
}

// Dashboard Stats
export interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    pendingBookings: number;
    totalVillas: number;
}

export interface Subscriber {
    id: string;
    email: string;
    subscribed_at: string;
}
