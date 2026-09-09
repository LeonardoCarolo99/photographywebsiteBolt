export interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string;
  sort_order: number;
  created_at: string;
}

export interface AlbumImage {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}
