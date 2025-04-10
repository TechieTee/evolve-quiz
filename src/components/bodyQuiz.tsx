import { useState, useEffect } from "react";
import AreaSelection from "./areaSelection";
import ConditionDisplay from "./conditionalDisplay";
import "./bodyQuiz.css";
import { Area, AreasResponse, Condition } from "../types/types";

interface SelectedBodyPart {
  area: Area;
  conditions: Condition[];
}

const BodyQuiz = () => {
  const [areasResponse, setAreasResponse] = useState<AreasResponse>([]);
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([]);
  const [currentArea, setCurrentArea] = useState<Area | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState<
    SelectedBodyPart[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFrontView, setShowFrontView] = useState(true);
  const [showConsultationSummary, setShowConsultationSummary] = useState(false);
  const [showForm, setShowForm] = useState(false);
  interface SubmittedData {
    name: string;
    email: string;
    phone: string;
    areas: string;
    conditions: string;
    date: string;
    groupedData: {
      bodyArea: string;
      conditions: string[];
      services: string[];
    }[];
  }

  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(
    null
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    areas: "",
    conditions: "",
    consent: false,
  });

  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://evolvequizdev.wpengine.com/wp-json/wp-evolve-body-quiz/v1/areas",
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch areas");
      }

      const data = (await response.json()) as Area[];
      setAreasResponse(data);
      setShowFrontView(data[1]?.children?.length > 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setAreasResponse({ message: errorMessage });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConditions = async (areaId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://evolvequizdev.wpengine.com/wp-json/wp-evolve-body-quiz/v1/conditions?area=${areaId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch conditions");
      }

      const data = (await response.json()) as Condition[];
      setConditions(data || []); // Ensure we always set an array
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load conditions";
      setError(errorMessage);
      setConditions([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    if (currentArea) {
      fetchConditions(currentArea.id);
    }
  }, [currentArea]);

  const handleAreaSelect = (area: Area) => {
    setCurrentArea(area);
    if (!selectedAreas.some((a) => a.id === area.id)) {
      setSelectedAreas((prev) => [...prev, area]);
    }
  };

  const toggleView = () => {
    setShowFrontView(!showFrontView);
    setCurrentArea(null);
  };

  const handleAddToConsultation = () => {
    if (currentArea && conditions.length > 0) {
      const existingIndex = selectedBodyParts.findIndex(
        (item) => item.area.id === currentArea.id
      );

      if (existingIndex >= 0) {
        // Update existing entry
        setSelectedBodyParts((prev) =>
          prev.map((item, index) =>
            index === existingIndex
              ? { ...item, conditions: [...item.conditions] }
              : item
          )
        );
      } else {
        // Add new entry
        setSelectedBodyParts((prev) => [
          ...prev,
          { area: currentArea, conditions: [] },
        ]);
      }
    }
    setShowConsultationSummary(true);
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setSubmittedData(null);
  };

  useEffect(() => {
    if (selectedBodyParts.length > 0) {
      setFormData((prev) => ({
        ...prev,
        areas: selectedBodyParts.map((item) => item.area.name).join(", "),
        conditions: selectedBodyParts
          .flatMap((item) => item.conditions.map((c) => c.title))
          .join(", "),
      }));
    }
  }, [selectedBodyParts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionDate = new Date().toLocaleString();

    // Create grouped data for submission
    const groupedData = selectedBodyParts.map((item) => ({
      bodyArea: item.area.name,
      conditions: item.conditions.map((c) => c.title),
      services: item.conditions.flatMap(
        (c) => c.recommended_services?.map((s) => s.title) || []
      ),
    }));

    setSubmittedData({
      ...formData,
      date: submissionDate,
      groupedData, // Add the grouped data to submittedData
    });

    setShowForm(false);
    setShowConsultationSummary(false);
  };

  const handleConditionSelect = (condition: Condition) => {
    if (!currentArea) return;

    setSelectedBodyParts((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.area.id === currentArea.id
      );

      if (existingIndex >= 0) {
        // Update existing body part's conditions
        return prev.map((item, index) => {
          if (index === existingIndex) {
            const conditionExists = item.conditions.some(
              (c) => c.id === condition.id
            );
            return {
              ...item,
              conditions: conditionExists
                ? item.conditions.filter((c) => c.id !== condition.id)
                : [...item.conditions, condition],
            };
          }
          return item;
        });
      } else {
        // Add new body part with this condition
        return [...prev, { area: currentArea, conditions: [condition] }];
      }
    });
  };

  const getSelectedConditionsForCurrentArea = () => {
    if (!currentArea) return [];
    const bodyPart = selectedBodyParts.find(
      (item) => item.area.id === currentArea.id
    );
    return bodyPart ? bodyPart.conditions : [];
  };

  if (isLoading)
    return <div className="loading-spinner">Loading quiz data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="quiz-main-grid">
      <div className="quiz-content-area">
        {!submittedData && (
          <>
            <div className="view-toggle-container">
              {/* <div onClick={toggleView} className="flipper">
                <Undo size={24} strokeWidth={2} className="undo-icon" />
              </div> */}
              <AreaSelection
                areasResponse={areasResponse}
                onSelect={handleAreaSelect}
                selectedAreas={selectedAreas}
                isLoading={isLoading}
                showFrontView={showFrontView}
              />
              <div onClick={toggleView} className="flipper">
                {/* <Redo size={24} strokeWidth={2} className="undo-icon" /> */}
                {showFrontView ? "Back" : showFrontView ? "Front" : "Front"}
              </div>
            </div>
          </>
        )}

        {/* {submittedData && (
          <div className="submission-card">
            <div className="card-header">
              <h3>Consultation Submitted Successfully!</h3>
              <p>Submitted on: {submittedData.date}</p>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Name:</span>
                <span className="data-value">{submittedData.name}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Email:</span>
                <span className="data-value">{submittedData.email}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Phone:</span>
                <span className="data-value">{submittedData.phone}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Body Areas:</span>
                <span className="data-value">{submittedData.areas}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Conditions:</span>
                <span className="data-value">{submittedData.conditions}</span>
              </div>
            </div>

            <ServiceRecommendations
              services={selectedBodyParts.flatMap((item) =>
                item.conditions.flatMap(
                  (condition) => condition.recommended_services || []
                )
              )}
            />

            <div className="card-footer">
              <button
                className="primary-button"
                onClick={() => {
                  setSubmittedData(null);
                  setSelectedAreas([]);
                  setSelectedBodyParts([]);
                  setCurrentArea(null);
                  setShowConsultationSummary(false);
                  setShowForm(false);
                }}
              >
                Start New Consultation
              </button>
            </div>
          </div>
        )} */}

        {/* (previous state and functions remain the same until the submission display) */}

        {submittedData && (
          <div className="submission-card">
            <div className="card-header">
              <h3 style={{ textAlign: "center" }}>
                Your Recommendations Are In!
              </h3>
              <p style={{ textAlign: "center" }}>
                Here is what we suggest based on your skin + body goals:
              </p>
              {/* <p>Submitted on: {submittedData.date}</p>
            </div>
            <div className="card-body">
              <div className="data-row">
                <span className="data-label">Name:</span>
                <span className="data-value">{submittedData.name}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Email:</span>
                <span className="data-value">{submittedData.email}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Phone:</span>
                <span className="data-value">{submittedData.phone}</span>
              </div> */}

              <div className="grouped-data">
                {selectedBodyParts.map((item) => {
                  // Get all unique services from all conditions for this body part
                  const allServices = item.conditions.flatMap(
                    (condition) => condition.recommended_services || []
                  );

                  // Only show card if there are services
                  if (allServices.length === 0) return null;

                  return (
                    <div key={item.area.id} className="recommendation-card">
                      <div className="card-content">
                        <div className="card-header">
                          <div className="body-part-header">
                            <span className="body-part-name">
                              {item.area.name}
                              {/* {conditions
                                .map((condition) => condition.title)
                                .join(", ")} */}
                            </span>
                          </div>
                        </div>

                        <div className="scroll-area">
                          <div className="scroll-content">
                            {/* <div className="conditions-list">
                              <ul>
                                {item.conditions.map((condition) => (
                                  <li key={condition.id}>{condition.title}</li>
                                ))}
                              </ul>
                            </div> */}

                            {/* <div className="services-list">
                              <h4>Recommended Services:</h4>
                              <div className="service-tags">
                                {allServices.map((service) => (
                                  <span key={service.id} className="tag">
                                    {service.title}
                                  </span>
                                ))}
                              </div>
                            </div> */}

                            {allServices.map((service) => (
                              <div key={service.id} className="treatment-item">
                                <div className="card-separator" />
                                <span className="card-badge">
                                  {service.taxonomy[0]?.name}
                                </span>
                                <h3>{service.title}</h3>
                                <p>
                                  {service?.description || "Description..."}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card-footer">
              <button
                className="link"
                onClick={() => {
                  setSubmittedData(null);
                  setSelectedAreas([]);
                  setSelectedBodyParts([]);
                  setCurrentArea(null);
                  setShowConsultationSummary(false);
                  setShowForm(false);
                }}
              >
                Take the quiz again
              </button>
              <button className="area-button" onClick={() => {}}>
                Book Appointment
              </button>
            </div>
          </div>
        )}
        {/* (rest of the component remains the same) */}
      </div>

      <div className="selection-panel">
        <>
          <h3 className="quiz-card-header-text">
            Your Selections
            {/* (
          {selectedBodyParts.reduce(
            (total, item) => total + item.conditions.length,
            0
          )}
          ) */}
          </h3>

          <span className="quiz-card-desc-text">
            Start your quiz by clicking on a body part you want to be treated.
          </span>
        </>

        <>
          {currentArea && (
            <ConditionDisplay
              bodypart={currentArea.name}
              conditions={conditions} // This will always be an array now
              onSelect={handleConditionSelect}
              selectedConditions={getSelectedConditionsForCurrentArea()}
            />
          )}

          {currentArea &&
            conditions.length > 0 &&
            !showConsultationSummary &&
            !showForm &&
            !submittedData && (
              <button
                onClick={handleAddToConsultation}
                className="area-button"
                style={{ marginTop: "60px" }}
              >
                ADD TREATMENTS
              </button>
            )}
        </>

        <>
          {showConsultationSummary && selectedBodyParts.length > 0 && (
            <div>
              <h3 className="quiz-card-header-text">
                Your Selections (
                {selectedBodyParts.reduce(
                  (total, item) => total + item.conditions.length,
                  0
                )}
                ){" "}
              </h3>
              {selectedBodyParts.map((item) => (
                <div key={item.area.id} className="body-part-section">
                  <p className="body-part-name">
                    <strong>{item.area.name}</strong>
                  </p>
                  {item.conditions.length > 0 ? (
                    <ul className="conditions-list">
                      {item.conditions.map((condition) => (
                        <li key={condition.id}>
                          {condition.title}{" "}
                          <span className="delete-icon">&times;</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-conditions">No conditions selected</p>
                  )}
                </div>
              ))}

              <button
                onClick={handleOpenForm}
                className="area-button"
                disabled={
                  selectedBodyParts.reduce(
                    (total, item) => total + item.conditions.length,
                    0
                  ) === 0
                }
              >
                COMPLETE CONSULTATION
              </button>
            </div>
          )}
        </>

        <>
          {showForm && (
            <div className="consultation-form">
              <div className="form-container">
                <h3>Complete your consultation</h3>
                {/* <p>
                {selectedBodyParts.length} body part(s) with{" "}
                {selectedBodyParts.reduce(
                  (total, item) => total + item.conditions.length,
                  0
                )}{" "}
                condition(s)
              </p> */}

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <input
                      type="checkbox"
                      id="consent"
                      name="consent"
                      checked={formData.consent || false}
                      onChange={handleInputChange}
                      required
                    />
                    <label htmlFor="consent" className="consent-text">
                      I agree to receiving appointment confirmations, reminders
                      and marketing communications via email and SMS messages.
                      Msg & data rates may apply. Msg frequency varies. Reply
                      HELP for help and STOP to cancel. View our{" "}
                      <a href="/privacy-policy">Privacy Policy</a>
                    </label>
                  </div>

                  <input type="hidden" name="areas" value={formData.areas} />
                  <input
                    type="hidden"
                    name="conditions"
                    value={formData.conditions}
                  />

                  <div className="form-actions">
                    {/* <button
                    type="button"
                    className="secondary-button"
                    onClick={() => {
                      setShowForm(false);
                      setShowConsultationSummary(true);
                    }}
                  >
                    Back
                  </button> */}
                    <button
                      type="submit"
                      className="area-button"
                      disabled={isLoading}
                    >
                      {isLoading ? "Submitting..." : "COMPLETE CONSULTATION"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      </div>
      {/* <ServiceRecommendations
                              services={item.conditions.flatMap(
                                (condition) =>
                                  condition.recommended_services || []
                              )}
                            /> */}
    </div>
  );
};

export default BodyQuiz;
