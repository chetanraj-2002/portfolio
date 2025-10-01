import { useState, useEffect } from 'react';

interface SlidingThumbnailProps {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
  startOnHover?: boolean;
}

export const SlidingThumbnail = ({ images, alt, className = "", interval = 2000, startOnHover = false }: SlidingThumbnailProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    if (startOnHover && !isHovered) return;

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, startOnHover, isHovered]);

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
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => startOnHover && setIsHovered(true)}
      onMouseLeave={() => {
        if (startOnHover) {
          setIsHovered(false);
          setCurrentIndex(0);
          setIsTransitioning(false);
        }
      }}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image || '/placeholder.svg'}
          alt={`${alt} - ${index + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
            index === currentIndex 
              ? isTransitioning 
                ? 'translate-x-[-100%]' 
                : 'translate-x-0' 
              : index === (currentIndex + 1) % images.length
              ? isTransitioning
                ? 'translate-x-0'
                : 'translate-x-[100%]'
              : 'translate-x-[100%]'
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
