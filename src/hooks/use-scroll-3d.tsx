import { useEffect, useRef, useState } from 'react';

export const useScroll3D = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 0.85, opacity: 0.3 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const elementCenter = rect.top + rect.height / 2;
      const distanceFromCenter = elementCenter - windowHeight / 2;
      
      // Check if element is in viewport
      const inViewport = elementTop < windowHeight * 0.75 && elementBottom > windowHeight * 0.25;
      
      if (inViewport && !isVisible) {
        setIsVisible(true);
      }
      
      // Calculate rotation based on scroll position - reduced angles
      const maxRotation = 20;
      const rotateX = (distanceFromCenter / windowHeight) * maxRotation;
      const rotateY = (distanceFromCenter / windowHeight) * 8;
      
      // Calculate scale and opacity based on visibility - reduced intensity
      const visibility = Math.max(0, Math.min(1, 1 - Math.abs(distanceFromCenter) / (windowHeight * 0.7)));
      const scale = 0.85 + visibility * 0.15; // From 0.85 to 1.0
      const opacity = Math.max(0.3, visibility); // From 0.3 to 1.0

      setTransform({ rotateX, rotateY, scale, opacity });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible]);

  return { ref, transform, isVisible };
};

export const useMouseMove3D = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 15;
      const rotateX = ((centerY - y) / centerY) * 15;

      setTransform({ rotateX, rotateY });
    };

    const element = ref.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', () => setTransform({ rotateX: 0, rotateY: 0 }));
    }

    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return { ref, transform };
};
