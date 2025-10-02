export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'agent' | 'user'
          name: string | null
          phone: string | null
          company: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'agent' | 'user'
          name?: string | null
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'agent' | 'user'
          name?: string | null
          phone?: string | null
          company?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stations: {
        Row: {
          id: number
          name: string
          line: string
          location: unknown
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          line: string
          location: unknown
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          line?: string
          location?: unknown
          created_at?: string
        }
      }
      regions: {
        Row: {
          id: number
          sido: string
          sigungu: string
          dong: string
          polygon: unknown | null
          created_at: string
        }
        Insert: {
          id?: number
          sido: string
          sigungu: string
          dong: string
          polygon?: unknown | null
          created_at?: string
        }
        Update: {
          id?: number
          sido?: string
          sigungu?: string
          dong?: string
          polygon?: unknown | null
          created_at?: string
        }
      }
      theme_categories: {
        Row: {
          id: number
          key: string
          label_ko: string
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: number
          key: string
          label_ko: string
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          key?: string
          label_ko?: string
          sort_order?: number
          created_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          code: string
          title: string
          description: string | null
          price_deposit: number | null
          price_monthly: number | null
          price_maintenance: number | null
          exclusive_m2: number | null
          supply_m2: number | null
          pyeong_exclusive: number | null
          pyeong_supply: number | null
          floor: number | null
          floors_total: number | null
          property_type: 'office' | 'retail' | 'whole_building' | 'residential' | 'etc'
          status: 'active' | 'hidden' | 'archived' | 'available' | 'reserved' | 'in_progress' | 'completed' | 'withdrawn'
          location: unknown
          address_road: string | null
          address_jibun: string | null
          near_boulevard: boolean
          built_year: number | null
          tags: string[]
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description?: string | null
          price_deposit?: number | null
          price_monthly?: number | null
          price_maintenance?: number | null
          exclusive_m2?: number | null
          supply_m2?: number | null
          floor?: number | null
          floors_total?: number | null
          property_type?: 'office' | 'retail' | 'whole_building' | 'residential' | 'etc'
          status?: 'active' | 'hidden' | 'archived' | 'available' | 'reserved' | 'in_progress' | 'completed' | 'withdrawn'
          location: unknown
          address_road?: string | null
          address_jibun?: string | null
          near_boulevard?: boolean
          built_year?: number | null
          tags?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string | null
          price_deposit?: number | null
          price_monthly?: number | null
          price_maintenance?: number | null
          exclusive_m2?: number | null
          supply_m2?: number | null
          floor?: number | null
          floors_total?: number | null
          property_type?: 'office' | 'retail' | 'whole_building' | 'residential' | 'etc'
          status?: 'active' | 'hidden' | 'archived' | 'available' | 'reserved' | 'in_progress' | 'completed' | 'withdrawn'
          location?: unknown
          address_road?: string | null
          address_jibun?: string | null
          near_boulevard?: boolean
          built_year?: number | null
          tags?: string[]
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      listing_images: {
        Row: {
          id: string
          listing_id: string
          path: string
          width: number | null
          height: number | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          path: string
          width?: number | null
          height?: number | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          path?: string
          width?: number | null
          height?: number | null
          sort_order?: number
          created_at?: string
        }
      }
      listing_stations: {
        Row: {
          listing_id: string
          station_id: number
          distance_m: number | null
        }
        Insert: {
          listing_id: string
          station_id: number
          distance_m?: number | null
        }
        Update: {
          listing_id?: string
          station_id?: number
          distance_m?: number | null
        }
      }
      listing_regions: {
        Row: {
          listing_id: string
          region_id: number
        }
        Insert: {
          listing_id: string
          region_id: number
        }
        Update: {
          listing_id?: string
          region_id?: number
        }
      }
      listing_themes: {
        Row: {
          listing_id: string
          theme_id: number
        }
        Insert: {
          listing_id: string
          theme_id: number
        }
        Update: {
          listing_id?: string
          theme_id?: number
        }
      }
      inquiries: {
        Row: {
          id: string
          listing_id: string | null
          name: string
          phone: string
          message: string | null
          source: 'web' | 'map' | 'list'
          assigned_to: string | null
          status: 'new' | 'in_progress' | 'done'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id?: string | null
          name: string
          phone: string
          message?: string | null
          source?: 'web' | 'map' | 'list'
          assigned_to?: string | null
          status?: 'new' | 'in_progress' | 'done'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string | null
          name?: string
          phone?: string
          message?: string | null
          source?: 'web' | 'map' | 'list'
          assigned_to?: string | null
          status?: 'new' | 'in_progress' | 'done'
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          name: string
          params: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          params: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          params?: Json
          created_at?: string
        }
      }
      recently_viewed: {
        Row: {
          user_id: string
          listing_id: string
          viewed_at: string
        }
        Insert: {
          user_id: string
          listing_id: string
          viewed_at?: string
        }
        Update: {
          user_id?: string
          listing_id?: string
          viewed_at?: string
        }
      }
    }
    Views: {
      listings_search: {
        Row: {
          listing_id: string
          search_text: unknown
          name_norm: string
          addr_norm: string
          choseong_key: string
        }
      }
    }
    Functions: {
      auth_user_role: {
        Args: {}
        Returns: 'admin' | 'agent' | 'user'
      }
      to_choseong: {
        Args: { input_text: string }
        Returns: string
      }
      ko_en_qwerty_variants: {
        Args: { input_text: string }
        Returns: string[]
      }
      make_search_vector: {
        Args: { name: string; address: string; tags: string[] }
        Returns: unknown
      }
      find_nearby_stations: {
        Args: { listing_location: unknown; max_distance_m?: number }
        Returns: { station_id: number; distance_m: number }[]
      }
    }
    Enums: {
      user_role: 'admin' | 'agent' | 'user'
      property_type: 'office' | 'retail' | 'whole_building' | 'residential' | 'etc'
      listing_status: 'active' | 'hidden' | 'archived' | 'available' | 'reserved' | 'in_progress' | 'completed' | 'withdrawn'
      inquiry_status: 'new' | 'in_progress' | 'done'
      inquiry_source: 'web' | 'map' | 'list'
    }
  }
}

export type Listing = Database['public']['Tables']['listings']['Row']
export type Station = Database['public']['Tables']['stations']['Row']
export type Region = Database['public']['Tables']['regions']['Row']
export type ThemeCategory = Database['public']['Tables']['theme_categories']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']