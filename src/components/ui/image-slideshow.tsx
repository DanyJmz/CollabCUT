
"use client";

import type { FC } from 'react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageInfo {
  src: string;
  alt: string;
  hint: string; // For data-ai-hint
}

interface ImageSlideshowProps {
  images: ImageInfo[];
  interval?: number; // Interval in milliseconds
  className?: string;
}

const ImageSlideshow: FC<ImageSlideshowProps> = ({
  images,
  interval = 3000, // Adjusted interval to 3 seconds as requested previously
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return; // No need for slideshow with 0 or 1 image

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (!images || images.length === 0) {
    return null; // Or return a placeholder
  }

  return (
    // Removed bg-card from the container div
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {images.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={image.alt}
          data-ai-hint={image.hint}
          fill // Use fill to cover the container
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust sizes as needed
          className={cn(
            "absolute inset-0 object-contain transition-opacity duration-1000 ease-in-out", // Kept object-contain as requested previously
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
          priority={index === 0} // Prioritize loading the first image
        />
      ))}
    </div>
  );
};

export default ImageSlideshow;
