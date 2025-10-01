import { useState, useEffect } from 'react';

interface SlidingThumbnailProps {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
}

export const SlidingThumbnail = ({ images, alt, className = "", interval = 2000 }: SlidingThumbnailProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  if (images.length === 0) {
    return (
      <img
        src="/placeholder.svg"
        alt={alt}
        className={className}
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image || '/placeholder.svg'}
          alt={`${alt} - ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white w-3' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
