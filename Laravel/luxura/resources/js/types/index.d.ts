export interface User {
    id: number;
    name: string;
    email: string;
    role: "customer" | "admin";
    phone?: string;
    avatar?: string;
    email_verified_at?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent_id?: number;
    is_active: boolean;
    sort_order: number;
    products_count?: number;
}

export interface ProductImage {
    id: number;
    product_id: number;
    path: string;
    alt?: string;
    is_primary: boolean;
    sort_order: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    short_description?: string;
    price: number;
    compare_price?: number;
    sku: string;
    stock: number;
    category_id: number;
    brand?: string;
    weight?: number;
    specifications?: Record<string, string>;
    is_active: boolean;
    is_featured: boolean;
    rating: number;
    reviews_count: number;
    discount_percentage?: number;
    is_on_sale?: boolean;
    category?: Category;
    images?: ProductImage[];
    primary_image?: ProductImage;
    approved_reviews?: Review[];
}

export interface CartItem {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        stock: number;
        brand?: string;
        images: { path: string }[];
    };
}

export interface Order {
    id: number;
    order_number: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    payment_status: "pending" | "paid" | "failed" | "refunded";
    payment_method: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    discount: number;
    total: number;
    shipping_name: string;
    shipping_phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_province: string;
    shipping_postal_code: string;
    notes?: string;
    created_at: string;
    paid_at?: string;
    shipped_at?: string;
    delivered_at?: string;
    items?: OrderItem[];
}

export interface OrderItem {
    id: number;
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
    subtotal: number;
    product?: Product;
}

export interface Review {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    user?: User;
}

export interface Wishlist {
    id: number;
    user_id: number;
    product_id: number;
    created_at: string;
    product?: Product;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    cartCount: number;
    flash?: {
        success?: string;
        error?: string;
    };
};
