import { useState, useEffect, useCallback } from 'react';

interface UseCarouselProps {
  totalItems: number;
  itemsPerView: number;
  autoPlayInterval?: number;
  autoPlay?: boolean;
}

export const useCarousel = ({
  totalItems,
  itemsPerView,
  autoPlayInterval = 5000,
  autoPlay = false
}: UseCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  
  const totalSlides = Math.ceil(totalItems / itemsPerView);
  
  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      return nextIndex >= totalSlides ? 0 : nextIndex;
    });
  }, [totalSlides]);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - 1;
      return nextIndex < 0 ? totalSlides - 1 : nextIndex;
    });
  }, [totalSlides]);
  
  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
    }
  }, [totalSlides]);
  
  const pauseAutoPlay = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  const resumeAutoPlay = useCallback(() => {
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);
  
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [goToNext, autoPlayInterval, isPlaying]);
  
  return {
    currentIndex,
    goToNext,
    goToPrevious,
    goToSlide,
    pauseAutoPlay,
    resumeAutoPlay,
    isPlaying,
    totalSlides
  };
};