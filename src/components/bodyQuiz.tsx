import { useState, useEffect } from "react";
import AreaSelection from "./areaSelection";
import ConditionDisplay from "./conditionalDisplay";
import "./bodyQuiz.css";
import { Area, AreasResponse, Condition } from "../types/types";

const BodyQuiz = () => {
  const [areasResponse, setAreasResponse] = useState<AreasResponse>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFrontView, setShowFrontView] = useState(true);
  const [showConsultationSummary, setShowConsultationSummary] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    conditions: "",
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
      setConditions(data);
      setSelectedConditions([]);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load conditions";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  useEffect(() => {
    if (selectedArea) {
      fetchConditions(selectedArea.id);
    }
  }, [selectedArea]);

  const handleAreaSelect = (area: Area) => {
    setSelectedArea(area);
    setSelectedConditions([]);
    setShowConsultationSummary(false);
    setSubmittedData(null);
  };

  const toggleView = () => {
    setShowFrontView(!showFrontView);
    setSelectedArea(null);
    setSelectedConditions([]);
  };

  const handleAddToConsultation = () => {
    setShowConsultationSummary(true);
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setSubmittedData(null);
  };

  useEffect(() => {
    if (selectedArea && selectedConditions.length > 0) {
      setFormData((prev) => ({
        ...prev,
        area: selectedArea.name,
        conditions: selectedConditions.map((c) => c.title).join(", "),
      }));
    }
  }, [selectedArea, selectedConditions]);

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
    setSubmittedData({
      ...formData,
      date: submissionDate,
    });
    setShowForm(false);
    setShowConsultationSummary(false);
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
              <button
                onClick={toggleView}
                className={`view-toggle ${showFrontView ? "active" : ""}`}
              >
                {showFrontView ? "Show Back View" : "Show Front View"}
              </button>
            </div>

            <AreaSelection
              areasResponse={areasResponse}
              onSelect={handleAreaSelect}
              selectedArea={selectedArea}
              isLoading={isLoading}
              showFrontView={showFrontView}
            />

            {showConsultationSummary &&
              selectedArea &&
              selectedConditions.length > 0 && (
                <div className="consultation-summary">
                  <h3> Your Selection ({selectedConditions.length})</h3>

                  <p>
                    <span className="label">Body Part:</span>{" "}
                    {selectedArea.name}
                  </p>

                  <h4>Selected Conditions:</h4>
                  <ul>
                    {selectedConditions.map((condition) => (
                      <li key={condition.id}>{condition.title}</li>
                    ))}
                  </ul>

                  <button
                    onClick={handleOpenForm}
                    className="consultation-form-button"
                  >
                    Finish Consultation
                  </button>
                </div>
              )}

            {showForm && (
              <div className="consultation-form">
                <div className="form-container">
                  <h3>Your Consultation Form</h3>
                  <p>
                    For {selectedArea?.name} - {selectedConditions.length}{" "}
                    condition(s)
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Full Name</label>
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
                      <label htmlFor="email">Email Address</label>
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
                      <label htmlFor="phone">Phone Number</label>
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

                    <input type="hidden" name="area" value={formData.area} />
                    <input
                      type="hidden"
                      name="conditions"
                      value={formData.conditions}
                    />

                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setShowForm(false);
                          setShowConsultationSummary(true);
                        }}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="primary-button"
                        disabled={isLoading}
                      >
                        {isLoading ? "Submitting..." : "Get My Results"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {submittedData && (
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
                <span className="data-label">Body Area:</span>
                <span className="data-value">{submittedData.area}</span>
              </div>
              <div className="data-row">
                <span className="data-label">Conditions:</span>
                <span className="data-value">{submittedData.conditions}</span>
              </div>
            </div>
            <div className="card-footer">
              <button
                className="primary-button"
                onClick={() => {
                  setSubmittedData(null);
                  setSelectedArea(null);
                  setSelectedConditions([]);
                  setShowConsultationSummary(false);
                  setShowForm(false);
                }}
              >
                Start New Consultation
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="selection-panel">
        <h3 className="quiz-card-header-text">
          Your Selection ({selectedConditions.length})
        </h3>
        {selectedArea && (
          <ConditionDisplay
            bodypart={selectedArea.name}
            conditions={conditions}
            onSelect={(condition) => {
              setSelectedConditions((prev) => {
                const exists = prev.find((c) => c.id === condition.id);
                return exists
                  ? prev.filter((c) => c.id !== condition.id)
                  : [...prev, condition];
              });
            }}
            selectedConditions={selectedConditions}
          />
        )}
        {selectedConditions.length > 0 &&
          !showConsultationSummary &&
          !showForm &&
          !submittedData && (
            <button onClick={handleAddToConsultation} className="area-button">
              Add to my consultation
            </button>
          )}
      </div>
    </div>
  );
};

export default BodyQuiz;
