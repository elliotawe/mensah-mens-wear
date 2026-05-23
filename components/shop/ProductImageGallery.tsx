'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

  return (
    <div className="flex flex-col gap-4">
      {/* Primary image */}
      <div className="relative aspect-[3/4] rounded-[6px] overflow-hidden bg-[var(--color-cream)]">
        <Image
          src={safeImages[activeIndex]}
          alt={`${productName} — image ${activeIndex + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {safeImages.map((src, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'relative flex-shrink-0 w-16 aspect-[3/4] rounded-[4px] overflow-hidden border-2 transition-all duration-200 cursor-pointer',
                i === activeIndex
                  ? 'border-[var(--color-gold)]'
                  : 'border-transparent opacity-60 hover:opacity-100'
              )}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === activeIndex}
              role="listitem"
            >
              <Image
                src={src}
                alt={`${productName} — thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
