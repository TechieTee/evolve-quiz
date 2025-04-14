import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "./serviceRecommendation.css";

interface ServiceRecommendationProps {
  resetQuiz: () => void;
  selectedBodyParts: {
    area: {
      id: number;
      name: string;
    };
    conditions: {
      id: number;
      title: string;
      recommended_services?: {
        id: number;
        title: string;
        description: string;
        taxonomy: { name: string }[];
      }[];
    }[];
  }[];
}

export const ServiceRecommendation = ({
  selectedBodyParts,
  resetQuiz,
}: ServiceRecommendationProps) => {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const carouselRefs = useRef<(HTMLDivElement | null)[]>([]);

  const treatmentSections = selectedBodyParts.map((bodyPart, sectionIndex) => {
    const treatments = bodyPart.conditions.flatMap(
      (condition) =>
        condition.recommended_services?.map((service) => ({
          category: service.taxonomy[0]?.name || "SERVICE",
          title: service.title,
          description: service.description || "Description...",
        })) || []
    );

    // Initialize active index for each section
    if (activeIndices[sectionIndex] === undefined) {
      activeIndices[sectionIndex] = 0;
    }

    return {
      title: bodyPart.conditions.flatMap(
        (condition) => condition.title || "Condition Title Not Available"
      ),
      treatments,
    };
  });

  const scrollToSlide = (sectionIndex: number, slideIndex: number) => {
    const carousel = carouselRefs.current[sectionIndex];
    if (carousel) {
      const slideWidth = carousel.children[0]?.clientWidth || 0;
      carousel.scrollTo({
        left: slideIndex * (slideWidth + 40),
        behavior: "smooth",
      });
      updateActiveIndex(sectionIndex, slideIndex);
    }
  };

  const handleScroll = (sectionIndex: number) => {
    const carousel = carouselRefs.current[sectionIndex];
    if (carousel) {
      const slideWidth = carousel.children[0]?.clientWidth || 0;
      const newIndex = Math.round(carousel.scrollLeft / (slideWidth + 40));
      updateActiveIndex(sectionIndex, newIndex);
    }
  };

  const updateActiveIndex = (sectionIndex: number, newIndex: number) => {
    setActiveIndices((prev) => {
      const newIndices = [...prev];
      newIndices[sectionIndex] = newIndex;
      return newIndices;
    });
  };

  const navigateSlide = (sectionIndex: number, direction: "prev" | "next") => {
    const currentIndex = activeIndices[sectionIndex] || 0;
    const treatments = treatmentSections[sectionIndex]?.treatments || [];
    const newIndex =
      direction === "prev"
        ? Math.max(0, currentIndex - 1)
        : Math.min(treatments.length - 1, currentIndex + 1);
    scrollToSlide(sectionIndex, newIndex);
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

        {treatmentSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="treatment-section">
            <div className="section-header">
              <h2 className="section-title">{section.title}</h2>
            </div>
            {section.treatments.length > 0 ? (
              <>
                <div className="carousel">
                  <div
                    className="carousel-content"
                    ref={(el) => {
                      carouselRefs.current[sectionIndex] = el;
                    }}
                    onScroll={() => handleScroll(sectionIndex)}
                  >
                    {section.treatments.map((treatment, index) => (
                      <div key={index} className="carousel-item">
                        <div className="card">
                          <div className="card-content">
                            <span className="badge">{treatment.category}</span>
                            <h3 className="treatment-title">
                              {treatment.title}
                            </h3>
                            <p className="treatment-description">
                              {treatment.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="carousel-navigation">
                    <button
                      className="carousel-prev"
                      onClick={() => navigateSlide(sectionIndex, "prev")}
                      disabled={activeIndices[sectionIndex] === 0}
                    >
                      <ArrowLeft className="w-5 h-5" color="black" />
                    </button>
                    <button
                      className="carousel-next"
                      onClick={() => navigateSlide(sectionIndex, "next")}
                      disabled={
                        activeIndices[sectionIndex] ===
                        section.treatments.length - 1
                      }
                    >
                      <ArrowRight className="w-5 h-5" color="black" />
                    </button>
                  </div>
                  <div className="dots-navigation">
                    {section.treatments.map((_, i) => (
                      <div
                        key={i}
                        className={`dot ${
                          i === activeIndices[sectionIndex] ? "active" : ""
                        }`}
                        onClick={() => scrollToSlide(sectionIndex, i)}
                      ></div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="no-treatments">
                No treatments recommended for this area
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
};
