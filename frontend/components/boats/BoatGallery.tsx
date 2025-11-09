'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { Image as ImageType } from '@/types';
import { cn } from '@/lib/utils';

interface BoatGalleryProps {
  images: ImageType[];
  boatName: string;
}

export function BoatGallery({ images, boatName }: BoatGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-muted">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const lightboxPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="group relative h-96 overflow-hidden rounded-lg lg:h-[500px]">
          <Image
            src={images[selectedImageIndex].url}
            alt={images[selectedImageIndex].alt?.en || boatName}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 opacity-0 transition-all hover:bg-white hover:scale-110 group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 opacity-0 transition-all hover:bg-white hover:scale-110 group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Zoom Button */}
          <button
            onClick={() => openLightbox(selectedImageIndex)}
            className="absolute right-4 bottom-4 rounded-full bg-white/90 p-3 opacity-0 transition-all hover:bg-white hover:scale-110 group-hover:opacity-100"
            aria-label="View fullscreen"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Image Counter */}
          <div className="absolute left-4 bottom-4 rounded-full bg-black/60 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 md:grid-cols-6 lg:gap-4">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative h-20 overflow-hidden rounded-lg transition-all hover:opacity-100 lg:h-24",
                  selectedImageIndex === index
                    ? "ring-2 ring-primary ring-offset-2 opacity-100"
                    : "opacity-60"
                )}
              >
                <Image
                  src={image.url}
                  alt={image.alt?.en || `${boatName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 16vw"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition-all hover:bg-white/20 hover:scale-110"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={lightboxPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={lightboxNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-4 text-white transition-all hover:bg-white/20 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image */}
          <div className="relative h-[90vh] w-[90vw]">
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt?.en || boatName}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Keyboard Instructions */}
          <div className="absolute bottom-8 right-8 rounded-lg bg-white/10 px-4 py-2 text-sm text-white/70 backdrop-blur-sm">
            Press ESC to close • Arrow keys to navigate
          </div>
        </div>
      )}
    </>
  );
}
