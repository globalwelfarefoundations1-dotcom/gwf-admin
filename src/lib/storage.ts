import { supabase, STORAGE_BUCKET } from './supabase';

const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, '_');

/**
 * Uploads a file to Supabase Storage and returns its public URL.
 * Mirrors `supabase.storage.from(bucket).upload(...)`, i.e. the same
 * multipart request the app's other Supabase-backed projects use.
 */
export async function uploadToStorage(file: File, folder: string): Promise<{ path: string; url: string }> {
  const path = `${folder}/${Date.now()}_${sanitize(file.name)}`;

  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function uploadManyToStorage(files: File[], folder: string): Promise<{ path: string; url: string }[]> {
  return Promise.all(files.map((file) => uploadToStorage(file, folder)));
}

/** Deletes a previously uploaded file, given the storage path returned by uploadToStorage. */
export async function removeFromStorage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}
