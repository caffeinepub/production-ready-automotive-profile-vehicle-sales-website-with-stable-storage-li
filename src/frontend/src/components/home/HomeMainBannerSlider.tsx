import { useEffect, useState } from 'react';

interface HomeMainBannerSliderProps {
  imageUrls: string[];
}

export default function HomeMainBannerSlider({ imageUrls }: HomeMainBannerSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Only auto-rotate if we have 2 or more images
  const shouldAutoRotate = imageUrls.length >= 2;

  useEffect(() => {
    if (!shouldAutoRotate) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
        setIsAnimating(false);
      }, 800); // Match animation duration
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [imageUrls.length, shouldAutoRotate]);

  // If only one image, render it statically
  if (imageUrls.length === 1) {
    return (
      <div className="w-full overflow-hidden">
        <img
          src={imageUrls[0]}
          alt="Mitsubishi Motors Banner"
          className="w-full h-auto object-cover"
        />
      </div>
    );
  }

  // If no images, return null
  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative banner-slider-container">
      <div className={`banner-slider-wrapper ${isAnimating ? 'sliding' : ''}`}>
        <img
          src={imageUrls[currentIndex]}
          alt={`Mitsubishi Motors Banner ${currentIndex + 1}`}
          className="w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}
