export interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  source: string;
  imageUrl?: string;
  category?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type NewsState = {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
};

export type LocationState = {
  data: Location | null;
  loading: boolean;
  error: string | null;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unavailable';
};