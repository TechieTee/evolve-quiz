import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "../pages/ResultsPage.css";

interface ServiceRecommendationProps {
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
  resetQuiz: () => void;
  conditionIds?: string;
}

interface Treatment {
  id: number;
  title: string;
  content: string;
  taxonomy: { name: string }[];
}

const sortTreatmentsByTaxonomy = (treatments: Treatment[]) => {
  const priorityOrder = [
    "Injectable Services",
    "Device Services",
    "Esthi Services",
    "Retail Items",
  ];

  return [...treatments].sort((a, b) => {
    const aTaxonomy = a.taxonomy[0]?.name || "SERVICE";
    const bTaxonomy = b.taxonomy[0]?.name || "SERVICE";

    const aIndex = priorityOrder.indexOf(aTaxonomy);
    const bIndex = priorityOrder.indexOf(bTaxonomy);

    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
};

export const ServiceRecommendation = ({
  selectedBodyParts,
  resetQuiz,
  conditionIds,
}: ServiceRecommendationProps) => {
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>(
    {}
  );
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

  const handleScroll = (key: string) => {
    const carousel = carouselRefs.current[key];
    if (!carousel) return;

    const scrollLeft = carousel.scrollLeft;
    const itemWidth = carousel.children[0]?.clientWidth || 0;
    const newIndex = Math.round(scrollLeft / (itemWidth + 24));
    setCurrentIndices((prev) => ({ ...prev, [key]: newIndex }));
  };

  const scrollToIndex = (key: string, index: number, totalSlides: number) => {
    const carousel = carouselRefs.current[key];
    if (!carousel) return;

    const clamped = Math.max(0, Math.min(index, totalSlides - 1));
    const itemWidth = carousel.children[0]?.clientWidth || 0;
    carousel.scrollTo({
      left: clamped * (itemWidth + 24),
      behavior: "smooth",
    });
  };

  return (
    <main className="result-recommendations">
      <div className="result-container">
        <header className="result-header">
          <h1 className="result-title">Your Recommendations Are In!</h1>
          <p className="result-subtitle">
            Here is what we suggest based on your <br />
            skin + body goals
          </p>
        </header>
        <footer style={{ margin: "1rem 0 6rem 0" }}>
          <button className="result-quiz-link" onClick={resetQuiz}>
            Take the quiz again
          </button>
          <a
            href="https://evolvemedspa.zenoti.com/webstoreNew/services?utm_source=direct&utm_medium=quiz"
            className="result-appointment-link"
          >
            Book Appointment
          </a>
        </footer>

        {selectedBodyParts.map((bodyPart, bodyIndex) =>
          bodyPart.conditions.map((condition, condIndex) => {
            const treatments = sortTreatmentsByTaxonomy(
              condition.recommended_services || []
            );
            const totalSlides = Math.ceil(treatments.length / itemsPerView);
            const carouselKey = `${bodyIndex}-${condIndex}`;
            const currentIndex = currentIndices[carouselKey] || 0;

            return (
              <section key={condIndex} className="result-treatment-section">
                <div className="result-section-header">
                  <h2 className="result-section-title">{condition.title}</h2>
                </div>

                {treatments.length > 0 ? (
                  <div className="result-carousel-container">
                    <button
                      className="result-carousel-nav-button carousel-nav-prev"
                      onClick={() =>
                        scrollToIndex(
                          carouselKey,
                          currentIndex - 1,
                          totalSlides
                        )
                      }
                      disabled={currentIndex === 0}
                    >
                      <ArrowLeft size={20} color="black" />
                    </button>

                    <div
                      className="result-carousel-content"
                      ref={(el) => {
                        carouselRefs.current[carouselKey] = el;
                      }}
                      onScroll={() => handleScroll(carouselKey)}
                    >
                      {treatments.map((treatment) => (
                        <div
                          key={treatment.id}
                          className="result-carousel-item"
                        >
                          <div className="result-card">
                            <div className="result-card-content">
                              <span className="result-badge">
                                {treatment.taxonomy[0]?.name || "SERVICE"}
                              </span>
                              <h3 className="result-treatment-title">
                                {treatment.title}
                              </h3>
                              <p className="result-treatment-description">
                                {treatment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      className="result-carousel-nav-button carousel-nav-next"
                      onClick={() =>
                        scrollToIndex(
                          carouselKey,
                          currentIndex + 1,
                          totalSlides
                        )
                      }
                      disabled={currentIndex >= totalSlides - 1}
                    >
                      <ArrowRight size={20} color="black" />
                    </button>

                    <div className="result-carousel-dots">
                      {[...Array(totalSlides)].map((_, idx) => (
                        <button
                          key={idx}
                          className={`carousel-dot ${
                            idx === currentIndex ? "carousel-dot-active" : ""
                          }`}
                          onClick={() =>
                            scrollToIndex(carouselKey, idx, totalSlides)
                          }
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="result-no-treatments">
                    No treatments recommended for this condition
                  </p>
                )}
              </section>
            );
          })
        )}

        {conditionIds && (
          <div
            className="share-link-box"
            style={{
              marginBottom: "3rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p style={{ fontWeight: "bold" }}>Your Sharable Result:</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <a
                href={`${window.location.origin}/#/results?qs=${conditionIds}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#70c1b3",
                  textDecoration: "underline",
                  whiteSpace: "nowrap",
                }}
              >
                View Result
              </a>

              <input
                type="text"
                value={`${window.location.origin}/#/results?qs=${conditionIds}`}
                readOnly
                onClick={(e) => e.currentTarget.select()}
                style={{
                  display: "none",
                  flex: 1,
                  padding: "10px",
                  background: "#f9f9f9",
                  border: "none",
                  outline: "none",
                  color: "#333",
                  borderRadius: "50px",
                  fontSize: "14px",
                  minWidth: "300px",
                }}
              />

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/#/results?qs=${conditionIds}`
                  );
                  alert("Link copied to clipboard!");
                }}
                style={{
                  padding: "10px 14px",
                  backgroundColor: "#70C1B3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
