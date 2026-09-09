/*
# Secure albums & images for admin-only writes, create storage bucket

## Summary
This migration locks down write access (INSERT/UPDATE/DELETE) on the albums
and images tables so that only authenticated users (the site owner via the
admin login) can modify data. Public visitors can still READ everything.
It also makes cover_image_url nullable so new albums can be created before
a cover photo is uploaded, and creates a public storage bucket for images.

## Changes

### 1. albums table
- `cover_image_url` is now nullable (was NOT NULL) so albums can be created
  without a cover image initially.

### 2. RLS policy changes on albums
- SELECT: unchanged — `TO anon, authenticated` (public reads)
- INSERT: changed from `TO anon, authenticated` to `TO authenticated` only
- UPDATE: changed from `TO anon, authenticated` to `TO authenticated` only
- DELETE: changed from `TO anon, authenticated` to `TO authenticated` only

### 3. RLS policy changes on images
- SELECT: unchanged — `TO anon, authenticated` (public reads)
- INSERT: changed from `TO anon, authenticated` to `TO authenticated` only
- UPDATE: changed from `TO anon, authenticated` to `TO authenticated` only
- DELETE: changed from `TO anon, authenticated` to `TO authenticated` only

### 4. Storage
- Creates a public bucket named `album-images` for storing uploaded photos.
- Storage policies: public read, authenticated-only write/upload/delete.
*/

-- Make cover_image_url nullable
ALTER TABLE albums ALTER COLUMN cover_image_url DROP NOT NULL;

-- === albums policies ===
DROP POLICY IF EXISTS "anon_select_albums" ON albums;
CREATE POLICY "anon_select_albums" ON albums FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_albums" ON albums;
DROP POLICY IF EXISTS "auth_insert_albums" ON albums;
CREATE POLICY "auth_insert_albums" ON albums FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_albums" ON albums;
DROP POLICY IF EXISTS "auth_update_albums" ON albums;
CREATE POLICY "auth_update_albums" ON albums FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_albums" ON albums;
DROP POLICY IF EXISTS "auth_delete_albums" ON albums;
CREATE POLICY "auth_delete_albums" ON albums FOR DELETE
  TO authenticated USING (true);

-- === images policies ===
DROP POLICY IF EXISTS "anon_select_images" ON images;
CREATE POLICY "anon_select_images" ON images FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_images" ON images;
DROP POLICY IF EXISTS "auth_insert_images" ON images;
CREATE POLICY "auth_insert_images" ON images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_images" ON images;
DROP POLICY IF EXISTS "auth_update_images" ON images;
CREATE POLICY "auth_update_images" ON images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_images" ON images;
DROP POLICY IF EXISTS "auth_delete_images" ON images;
CREATE POLICY "auth_delete_images" ON images FOR DELETE
  TO authenticated USING (true);

-- === Storage bucket ===
INSERT INTO storage.buckets (id, name, public)
VALUES ('album-images', 'album-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, authenticated write
DROP POLICY IF EXISTS "Public read album-images" ON storage.objects;
CREATE POLICY "Public read album-images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'album-images');

DROP POLICY IF EXISTS "Auth upload album-images" ON storage.objects;
CREATE POLICY "Auth upload album-images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'album-images');

DROP POLICY IF EXISTS "Auth update album-images" ON storage.objects;
CREATE POLICY "Auth update album-images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'album-images') WITH CHECK (bucket_id = 'album-images');

DROP POLICY IF EXISTS "Auth delete album-images" ON storage.objects;
CREATE POLICY "Auth delete album-images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'album-images');
