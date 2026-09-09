/*
# Create albums and images tables for motorsport photography portfolio

1. New Tables
- `albums`
  - `id` (uuid, primary key)
  - `title` (text, not null) — album name shown on the home page grid
  - `description` (text, nullable) — longer description shown on album detail page
  - `cover_image_url` (text, not null) — the photo displayed on the home page tile
  - `sort_order` (integer, default 0) — controls display order on home page
  - `created_at` (timestamptz, default now())
- `images`
  - `id` (uuid, primary key)
  - `album_id` (uuid, FK to albums, ON DELETE CASCADE)
  - `image_url` (text, not null) — the photo URL
  - `caption` (text, nullable) — optional caption shown in the gallery
  - `sort_order` (integer, default 0) — controls display order within an album
  - `created_at` (timestamptz, default now())

2. Security
- RLS enabled on both tables.
- This is a single-tenant public portfolio with no sign-in screen, so all CRUD
  is open to anon + authenticated (the data is intentionally public/shared).
- Index on images.album_id for efficient lookups.
*/

CREATE TABLE IF NOT EXISTS albums (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  cover_image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_albums" ON albums;
CREATE POLICY "anon_select_albums" ON albums FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_albums" ON albums;
CREATE POLICY "anon_insert_albums" ON albums FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_albums" ON albums;
CREATE POLICY "anon_update_albums" ON albums FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_albums" ON albums;
CREATE POLICY "anon_delete_albums" ON albums FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id uuid NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  caption text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_images" ON images;
CREATE POLICY "anon_select_images" ON images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_images" ON images;
CREATE POLICY "anon_insert_images" ON images FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_images" ON images;
CREATE POLICY "anon_update_images" ON images FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_images" ON images;
CREATE POLICY "anon_delete_images" ON images FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_images_album_id ON images(album_id);
