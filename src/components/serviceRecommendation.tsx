import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./serviceRecommendation.css";

interface ServiceRecommendationProps {
  resetQuiz: () => void;
  selectedBodyParts: {
    area: { id: number; name: string };
    conditions: {
      id: number;
      title: string;
      recommended_services?: {
        id: number;
        title: string;
        content: string;
        taxonomy: { name: string }[];
      }[];
    }[];
  }[];
}

export const ServiceRecommendation = ({
  selectedBodyParts,
  resetQuiz,
}: ServiceRecommendationProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateResponsive = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };

    updateResponsive();
    window.addEventListener("resize", updateResponsive);
    return () => window.removeEventListener("resize", updateResponsive);
  }, []);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollLeft = carouselRef.current.scrollLeft;
      const itemWidth = carouselRef.current.children[0]?.clientWidth || 0;
      const newIndex = Math.round(scrollLeft / (itemWidth + 24));
      setCurrentIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.children[0]?.clientWidth || 0;
      carouselRef.current.scrollTo({
        left: index * (itemWidth + 24),
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="recommendations">
      <div className="container">
        <header className="header">
          <h1 className="title">Your Recommendations Are In!</h1>
          <p className="subtitle">
            Here is what we suggest based on your skin + body goals
          </p>
          <div className="button-group">
            <button className="link-button" onClick={resetQuiz}>
              Take the quiz again
            </button>
            <button className="appointment-button">Book Appointment</button>
          </div>
        </header>

        {selectedBodyParts.map((bodyPart, bodyIndex) => (
          <div key={bodyIndex}>
            {bodyPart.conditions.map((condition, condIndex) => {
              const treatments = condition.recommended_services || [];
              const totalSlides = Math.ceil(treatments.length / itemsPerView);

              return (
                <section key={condIndex} className="treatment-section">
                  <div className="section-header">
                    <h2 className="section-title">{condition.title}</h2>
                  </div>

                  {treatments.length > 0 ? (
                    <div className="carousel-container">
                      <button
                        className="carousel-nav-button carousel-nav-prev"
                        onClick={() => scrollToIndex(currentIndex - 1)}
                        disabled={currentIndex === 0}
                      >
                        <ChevronLeft size={20} color="black" />
                      </button>

                      <div
                        className="carousel-content"
                        ref={carouselRef}
                        onScroll={handleScroll}
                      >
                        {treatments.map((treatment, index) => (
                          <div key={index} className="carousel-item">
                            <div className="card">
                              <div className="card-content">
                                <span className="badge">
                                  {treatment.taxonomy[0]?.name || "SERVICE"}
                                </span>
                                <h3 className="treatment-title">
                                  {treatment.title}
                                </h3>
                                <p className="treatment-description">
                                  {treatment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        className="carousel-nav-button carousel-nav-next"
                        onClick={() => scrollToIndex(currentIndex + 1)}
                        disabled={currentIndex >= totalSlides - 1}
                      >
                        <ChevronRight size={20} color="black" />
                      </button>

                      <div className="carousel-dots">
                        {[...Array(totalSlides)].map((_, idx) => (
                          <button
                            key={idx}
                            className={`carousel-dot ${
                              idx === currentIndex ? "carousel-dot-active" : ""
                            }`}
                            onClick={() => scrollToIndex(idx)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="no-treatments">
                      No treatments recommended for this condition
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
};
