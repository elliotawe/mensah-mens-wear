'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { createCampaign } from '@/lib/api/campaigns';
import { getItems } from '@/lib/api/items';
import { uploadImage } from '@/lib/api/uploads';
import type { ItemDisplay } from '@/lib/api/items';
import { formatPrice } from '@/lib/api/items';
import { Upload, X, Check } from 'lucide-react';

export default function NewCampaignPage() {
  useAdminAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [copyText, setCopyText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [items, setItems] = useState<ItemDisplay[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemSearch, setItemSearch] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [imageError, setImageError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    getItems().then(setItems).catch(() => {});
  }, []);

  function handleImageSelect(file: File) {
    if (!file.type.startsWith('image/')) {
      setImageError('Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image must be under 10MB.');
      return;
    }
    setImageError('');
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setUploadedUrl(null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  }

  function toggleItem(id: string) {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function handlePublish() {
    if (!title.trim()) {
      setTitleError('Campaign title is required');
      return;
    }
    setTitleError('');
    setPublishing(true);

    try {
      let finalImageUrl: string | undefined;

      if (imageFile && !uploadedUrl) {
        // Fake progress
        const interval = setInterval(() => setUploadProgress(p => Math.min(p + 10, 90)), 200);
        try {
          finalImageUrl = await uploadImage(imageFile);
          setUploadedUrl(finalImageUrl);
          setUploadProgress(100);
        } finally {
          clearInterval(interval);
        }
      } else {
        finalImageUrl = uploadedUrl ?? undefined;
      }

      await createCampaign({
        title: title.trim(),
        copy_text: copyText.trim() || undefined,
        image_urls: finalImageUrl ? [finalImageUrl] : undefined,
        featured_item_ids: selectedIds.length > 0 ? selectedIds : undefined,
      });

      setToast('Campaign published successfully!');
      setTimeout(() => router.push('/admin/dashboard/campaigns'), 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create campaign';
      setToast(`Error: ${msg}`);
      setPublishing(false);
    }
  }

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-3xl flex flex-col gap-10">
        <div>
          <p className="eyebrow mb-2">New</p>
          <h1 className="font-display text-3xl font-300 text-[var(--color-parchment)]">Create Campaign</h1>
        </div>

        {/* Section 1 — Basic Info */}
        <section className="flex flex-col gap-6">
          <h2 className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)] border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            Basic Info
          </h2>

          <div className="flex flex-col gap-2">
            <label htmlFor="camp-title" className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)]">
              Campaign Title <span className="text-[var(--color-error)]">*</span>
            </label>
            <input
              id="camp-title"
              value={title}
              onChange={e => { setTitle(e.target.value); setTitleError(''); }}
              placeholder='e.g. The Heritage Collection'
              className="h-11 bg-transparent border rounded-[4px] px-4 font-body text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-taupe)]/50 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
              style={{ borderColor: titleError ? 'var(--color-error)' : 'rgba(255,255,255,0.15)' }}
              aria-invalid={!!titleError}
            />
            {titleError && <p className="font-body text-xs text-[var(--color-error)]">{titleError}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="camp-copy" className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)]">
              Body Copy
            </label>
            <textarea
              id="camp-copy"
              value={copyText}
              onChange={e => setCopyText(e.target.value)}
              placeholder="Write compelling marketing copy for this campaign…"
              rows={5}
              className="bg-transparent border rounded-[4px] px-4 py-3 font-body text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-taupe)]/50 focus:outline-none focus:border-[var(--color-gold)] transition-colors resize-none"
              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
            />
          </div>
        </section>

        {/* Section 2 — Image */}
        <section className="flex flex-col gap-6">
          <h2 className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)] border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            Campaign Image
          </h2>

          {imagePreview ? (
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-[6px] overflow-hidden">
              <Image src={imagePreview} alt="Campaign preview" fill className="object-cover" sizes="400px" />
              <button
                onClick={() => { setImageFile(null); setImagePreview(null); setUploadedUrl(null); setUploadProgress(0); }}
                className="absolute top-2 right-2 size-7 rounded-full bg-[var(--color-obsidian)]/80 flex items-center justify-center text-white hover:bg-[var(--color-error)] transition-colors cursor-pointer"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-charcoal)]">
                  <div className="h-full bg-[var(--color-gold)] transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                </div>
              )}
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="relative flex flex-col items-center justify-center gap-4 p-10 rounded-[6px] border-2 border-dashed cursor-pointer transition-colors hover:border-[var(--color-gold)]"
              style={{ borderColor: imageError ? 'var(--color-error)' : 'rgba(255,255,255,0.15)' }}
              onClick={() => document.getElementById('image-picker')?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload campaign image"
              onKeyDown={e => e.key === 'Enter' && document.getElementById('image-picker')?.click()}
            >
              <Upload className="size-8 text-[var(--color-taupe)]" aria-hidden="true" />
              <p className="font-body text-sm text-[var(--color-taupe)] text-center">
                Drag & drop or <span className="text-[var(--color-gold)]">browse</span>
              </p>
              <p className="font-body text-xs text-[var(--color-taupe)]/60">JPG, PNG, WebP — max 10MB</p>
              <input
                id="image-picker"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(f); }}
              />
            </div>
          )}
          {imageError && <p className="font-body text-xs text-[var(--color-error)]">{imageError}</p>}
        </section>

        {/* Section 3 — Featured Items */}
        <section className="flex flex-col gap-6">
          <h2 className="font-accent text-[10px] tracking-widest uppercase text-[var(--color-taupe)] border-b pb-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            Featured Products (optional)
          </h2>

          {/* Selected chips */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedIds.map(id => {
                const item = items.find(i => i.id === id);
                if (!item) return null;
                return (
                  <button
                    key={id}
                    onClick={() => toggleItem(id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-body text-xs cursor-pointer"
                    style={{ background: 'var(--color-gold-muted)', color: 'var(--color-gold)', border: '1px solid rgba(201,168,76,0.3)' }}
                  >
                    {item.name}
                    <X className="size-3" aria-hidden="true" />
                  </button>
                );
              })}
            </div>
          )}

          <input
            type="search"
            value={itemSearch}
            onChange={e => setItemSearch(e.target.value)}
            placeholder="Search items by name…"
            className="h-10 bg-transparent border rounded-[4px] px-4 font-body text-sm text-[var(--color-parchment)] placeholder:text-[var(--color-taupe)]/50 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
          />

          <div
            className="max-h-64 overflow-y-auto rounded-[6px] border divide-y"
            style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          >
            {filteredItems.map(item => {
              const selected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => item.in_stock && toggleItem(item.id)}
                  disabled={!item.in_stock}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: selected ? 'var(--color-gold-muted)' : 'var(--color-charcoal)' }}
                >
                  <div
                    className="size-5 rounded flex items-center justify-center shrink-0 border"
                    style={{
                      background: selected ? 'var(--color-gold)' : 'transparent',
                      borderColor: selected ? 'var(--color-gold)' : 'rgba(255,255,255,0.2)',
                    }}
                  >
                    {selected && <Check className="size-3 text-[var(--color-obsidian)]" aria-hidden="true" />}
                  </div>
                  <span className="font-body text-sm text-[var(--color-parchment)] flex-1 min-w-0 truncate">
                    {item.name}
                  </span>
                  <span className="font-accent text-xs text-[var(--color-gold)] shrink-0">
                    {formatPrice(item.price_minor, item.currency)}
                  </span>
                  {!item.in_stock && (
                    <span className="font-accent text-[9px] tracking-wider uppercase text-[var(--color-error)] shrink-0">
                      Out of Stock
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Publish */}
        <button
          onClick={handlePublish}
          disabled={publishing}
          className="h-12 flex items-center justify-center gap-2 bg-[var(--color-gold)] text-[var(--color-obsidian)] font-accent text-[11px] tracking-widest uppercase rounded-[6px] hover:bg-[var(--color-gold-light)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {publishing ? (
            <>
              <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" aria-hidden="true" />
              Publishing…
            </>
          ) : 'Publish Campaign'}
        </button>

        {toast && (
          <div
            className="p-4 rounded-[6px] font-body text-sm"
            style={{
              background: toast.startsWith('Error') ? 'rgba(139,46,46,0.15)' : 'rgba(74,124,89,0.15)',
              color: toast.startsWith('Error') ? 'var(--color-error)' : '#4A7C59',
              border: `1px solid ${toast.startsWith('Error') ? 'var(--color-error)' : '#4A7C59'}`,
            }}
            role="alert"
          >
            {toast}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
