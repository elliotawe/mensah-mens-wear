import { API_BASE } from './config';

export async function uploadImage(file: File): Promise<string> {
  if (file.size > 10 * 1024 * 1024) throw new Error('File exceeds 10MB limit');
  if (!file.type.startsWith('image/')) throw new Error('File must be an image');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    body: formData,
  });

  if (res.status === 413) throw new Error('Image too large (max 10MB)');
  if (res.status === 422) throw new Error('Invalid file type');
  if (!res.ok) throw new Error('Upload failed');

  const data = await res.json();
  return data.url;
}

export async function rehostImage(sourceUrl: string): Promise<string> {
  const res = await fetch(`${API_BASE}/uploads/rehost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_url: sourceUrl }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? 'Rehost failed');
  }
  const data = await res.json();
  return data.url;
}
