export interface University {
  id: string;
  name: string;
  abbr: string;
  state: string;
  logo_url?: string;
  student_count: number;
  creator_count: number;
  created_at: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  university_id?: string;
  department?: string;
  level?: string;
  is_creator: boolean;
  is_admin: boolean;
  email_verified: boolean;
  created_at: string;
  university?: University;
}

export interface Creator {
  id: string;
  profile_id: string;
  display_name: string;
  handle: string;
  description?: string;
  cover_image_url?: string;
  verified: boolean;
  total_sales: number;
  total_revenue: number;
  rating: number;
  university_id?: string;
  created_at: string;
  profile?: Profile;
  university?: University;
}

export interface Community {
  id: string;
  creator_id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  type: string;
  price: number;
  is_paid: boolean;
  member_count: number;
  university_id?: string;
  is_active: boolean;
  created_at: string;
  creator?: Creator;
  is_member?: boolean;
}

export interface Product {
  id: string;
  creator_id: string;
  title: string;
  slug: string;
  description?: string;
  category: string;
  price: number;
  image_urls?: string[];
  file_url?: string;
  file_size?: string;
  file_type?: string;
  preview_url?: string;
  sales_count: number;
  rating: number;
  is_published: boolean;
  university_id?: string;
  created_at: string;
  creator?: Creator;
  is_purchased?: boolean;
}

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  title?: string;
  content: string;
  is_premium: boolean;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  author?: Profile;
  community?: Community;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  author?: Profile;
}

export interface Purchase {
  id: string;
  user_id: string;
  product_id: string;
  amount: number;
  status: "pending" | "completed" | "refunded";
  reference?: string;
  created_at: string;
  product?: Product;
}

export interface Membership {
  id: string;
  user_id: string;
  community_id: string;
  status: "active" | "expired" | "cancelled";
  expires_at?: string;
  created_at: string;
  community?: Community;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: string;
  target_id: string;
  reason: string;
  description?: string;
  status: "pending" | "resolved" | "dismissed";
  resolved_by?: string;
  created_at: string;
  reporter?: Profile;
}

export interface Review {
  id: string;
  user_id: string;
  product_id?: string;
  creator_id?: string;
  rating: number;
  comment?: string;
  created_at: string;
  user?: Profile;
}

export type PaymentStatus = "idle" | "processing" | "success" | "failed";
