'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

type Props = {
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
};

export default function ImageUpload({ currentUrl, onUploaded }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type and size
    if (!file.type.startsWith('image/')) {
      setError('Only image files allowed (JPG, PNG, WebP)');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('File too large — max 3 MB');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(path);

      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Preview */}
      <div className="relative w-full aspect-[4/3] border border-line rounded bg-paper overflow-hidden">
        {preview ? (
          <Image
            src={preview}
            alt="Product preview"
            fill
            className="object-contain p-2"
            sizes="400px"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="font-mono text-xs text-muted uppercase tracking-wide">
              No photo yet
            </span>
          </div>
        )}
      </div>

      {/* Upload input */}
      <label className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-wide text-muted">
          {preview ? 'Change photo' : 'Upload photo'} (JPG / PNG / WebP, max 3 MB)
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          disabled={uploading}
          className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border file:border-line file:bg-white file:text-sm file:font-sans file:text-ink hover:file:border-teal file:cursor-pointer disabled:opacity-60"
        />
      </label>

      {uploading && (
        <p className="text-xs font-mono text-teal animate-pulse">Uploading...</p>
      )}
      {error && (
        <p className="text-xs font-mono text-copper-dark">{error}</p>
      )}
    </div>
  );
}
