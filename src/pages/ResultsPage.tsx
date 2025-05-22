import { useEffect, useState, useRef } from "react";
// import { useLocation, useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Condition } from "../types/types";
import "./ResultsPage.css";

const sortTreatmentsByTaxonomy = (
  treatments: {
    taxonomy: { name: string }[];
    title?: string;
    content?: string;
  }[]
) => {
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

const ResultsPage = () => {
  // const [searchParams] = useSearchParams();
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [currentIndices, setCurrentIndices] = useState<Record<string, number>>(
    {}
  );
  const [itemsPerView, setItemsPerView] = useState(1);
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { search } = useLocation();
  const conditionIds = new URLSearchParams(search).get("qs");

  useEffect(() => {
    const fetchConditionById = async (id: string) => {
      const res = await fetch(
        `https://evolvequizdev.wpengine.com/wp-json/wp-evolve-body-quiz/v1/condition?condition_id=${id}`
      );
      return res.ok ? await res.json() : null;
    };

    const loadConditions = async () => {
      if (!conditionIds) return;
      const ids = conditionIds.split("-").map((id) => id.trim());
      const data = await Promise.all(ids.map(fetchConditionById));
      setConditions(data.filter(Boolean));
    };

    loadConditions();
  }, [conditionIds]);

  // useEffect(() => {
  //   const fetchConditionById = async (id: string) => {
  //     const res = await fetch(
  //       `https://evolvequizdev.wpengine.com/wp-json/wp-evolve-body-quiz/v1/condition?condition_id=${id}`,
  //       {
  //         credentials: "include", // Include credentials for API authentication
  //       }
  //     );

  //     if (!res.ok) return null;
  //     return await res.json();
  //   };

  //   const loadConditions = async () => {
  //     const conditionIdsParam = searchParams.get("qs");
  //     if (!conditionIdsParam) return;
  //     const ids = conditionIdsParam.split("-").map((id) => id.trim());
  //     const data = await Promise.all(ids.map(fetchConditionById));
  //     setConditions(data.filter(Boolean));
  //   };

  //   loadConditions();
  // }, [searchParams]);

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
      {/* <ServiceRecommendation
        selectedBodyParts={[
          { area: { id: 0, name: "Shared Result" }, conditions },
        ]}
        resetQuiz={() => (window.location.href = "/")}
      /> */}
      <div className="result-container">
        <header className="result-header">
          <h1 className="result-title">Your Recommendations Are In!</h1>
          <p className="result-subtitle">
            Here is what we suggest based on your <br />
            skin + body goals
          </p>
        </header>

        {conditions.map((condition, index) => {
          const treatments = sortTreatmentsByTaxonomy(
            condition.recommended_services || []
          );
          const totalSlides = Math.ceil(treatments.length / itemsPerView);
          const currentIndex = currentIndices[`${index}`] || 0;

          return (
            <section key={index} className="result-treatment-section">
              <div className="result-section-header">
                <h2 className="result-section-title">{condition.title}</h2>
              </div>

              {treatments.length > 0 ? (
                <div className="result-carousel-container">
                  <button
                    className="result-carousel-nav-button carousel-nav-prev"
                    onClick={() =>
                      scrollToIndex(`${index}`, currentIndex - 1, totalSlides)
                    }
                    disabled={currentIndex === 0}
                  >
                    <ArrowLeft size={20} color="black" />
                  </button>

                  <div
                    className="result-carousel-content"
                    ref={(el) => {
                      carouselRefs.current[`${index}`] = el;
                    }}
                    onScroll={() => handleScroll(`${index}`)}
                  >
                    {treatments.map((treatment) => (
                      <div
                        key={treatment.taxonomy[0]?.name || Math.random()}
                        className="result-carousel-item"
                      >
                        <div className="result-card">
                          <div className="result-card-content">
                            <span className="result-badge">
                              {treatment.taxonomy[0]?.name || "SERVICE"}
                            </span>
                            <h3 className="result-treatment-title">
                              {treatment.title || "Untitled Treatment"}
                            </h3>
                            <p className="result-treatment-description">
                              {treatment.content || "Description not available"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="result-carousel-nav-button carousel-nav-next"
                    onClick={() =>
                      scrollToIndex(`${index}`, currentIndex + 1, totalSlides)
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
                          scrollToIndex(`${index}`, idx, totalSlides)
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
        })}
        <footer>
          <a href="/quiz" className="result-quiz-link">
            Take the quiz again
          </a>
          <a
            href="https://evolvemedspa.zenoti.com/webstoreNew/services?utm_source=direct&utm_medium=quiz"
            className="result-appointment-link"
          >
            Book Appointment
          </a>
        </footer>
      </div>
    </main>
  );
};

export default ResultsPage;
