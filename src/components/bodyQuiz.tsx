import { useState, useEffect } from "react";
import Spinner from "./spinner";
// import AreaSelection from "./areaSelection";
import ConditionDisplay from "./conditionalDisplay";
import "./bodyQuiz.css";
import { Area, AreasResponse, Condition } from "../types/types";
import { ServiceRecommendation } from "./serviceRecommendation";
import BodyMapSVG from "./BodyMapSVG";

interface SelectedBodyPart {
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

  // Updated view states
  const [showFrontView, setShowFrontView] = useState(true);
  const [showBackView, setShowBackView] = useState(false);
  const [showFaceView, setShowFaceView] = useState(false);

  const [showConsultationSummary, setShowConsultationSummary] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [gender, setGender] = useState<"male" | "female">("male");

  interface SubmittedData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    areas: string;
    conditions: string;
    date: string;
    location: string;
    consent: boolean;
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
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    areas: "",
    conditions: "",
    consent: false,
    location: "",
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
      setConditions(Array.isArray(data) ? data : []); // Ensure it's always an array
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load conditions";
      setError(errorMessage);
      setConditions([]); // Set to empty array on error
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
    setShowConsultationSummary(false);
    setShowForm(false);
    if (!selectedAreas.some((a) => a.id === area.id)) {
      setSelectedAreas((prev) => [...prev, area]);
    }
  };

  const toggleView = (viewType: "front" | "back" | "face") => {
    setShowFrontView(viewType === "front");
    setShowBackView(viewType === "back");
    setShowFaceView(viewType === "face");
    setCurrentArea(null);
    setShowConsultationSummary(false);
    setShowForm(false);
  };

  const handleAddToConsultation = () => {
    if (currentArea && conditions.length > 0) {
      const existingIndex = selectedBodyParts.findIndex(
        (item) => item.area.id === currentArea.id
      );

      if (existingIndex >= 0) {
        setSelectedBodyParts((prev) =>
          prev.map((item, index) =>
            index === existingIndex
              ? { ...item, conditions: [...item.conditions] }
              : item
          )
        );
      } else {
        setSelectedBodyParts((prev) => [
          ...prev,
          { area: currentArea, conditions: [] },
        ]);
      }
    }
    setShowConsultationSummary(true);
    setCurrentArea(null);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionDate = new Date().toLocaleString();

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
      groupedData,
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
        return [...prev, { area: currentArea, conditions: [condition] }];
      }
    });
  };

  const handleRemoveCondition = (areaId: number, conditionId: number) => {
    setSelectedBodyParts(
      (prev) =>
        prev
          .map((item) => {
            if (item.area.id === areaId) {
              const updatedConditions = item.conditions.filter(
                (c) => c.id !== conditionId
              );
              return {
                ...item,
                conditions: updatedConditions,
              };
            }
            return item;
          })
          .filter((item) => item.conditions.length > 0) // Remove body parts with no conditions
    );
  };

  const getSelectedConditionsForCurrentArea = (): Condition[] => {
    if (!currentArea) return [];
    const bodyPart = selectedBodyParts.find(
      (item) => item.area.id === currentArea.id
    );
    return bodyPart ? bodyPart.conditions : [];
  };
  const findAreaByName = (areas: Area[], name: string): Area | undefined => {
    for (const area of areas) {
      if (area.name === name) return area;
      if (area.children?.length) {
        const found = findAreaByName(area.children, name);
        if (found) return found;
      }
    }
    return undefined;
  };
  const resetQuiz = () => {
    setSubmittedData(null);
    setSelectedAreas([]);
    setSelectedBodyParts([]);
    setCurrentArea(null);
    setShowConsultationSummary(false);
    setShowForm(false);
    setShowFrontView(true);
    setShowBackView(false);
    setShowFaceView(false);
  };

  if (error) return <div className="error-message">Error: {error}</div>;
  const renderGenderToggle = () => (
    <div className="gender-toggle">
      <button
        className={`gender-button ${gender === "male" ? "active" : ""}`}
        onClick={() => setGender("male")}
      >
        Male
      </button>
      <button
        className={`gender-button ${gender === "female" ? "active" : ""}`}
        onClick={() => setGender("female")}
      >
        Female
      </button>
    </div>
  );
  const renderBodyToggle = () => (
    <div className="view-toggle-buttons">
      {!showFrontView && (
        <button onClick={() => toggleView("front")} className="flipper">
          Front
        </button>
      )}
      {!showBackView && (
        <button onClick={() => toggleView("back")} className="flipper">
          Back
        </button>
      )}
      {!showFaceView && (
        <button onClick={() => toggleView("face")} className="flipper">
          Face
        </button>
      )}
    </div>
  );
  const renderSelectionPanelContent = () => {
    if (submittedData) return null;

    if (showForm) {
      return (
        <div className="consultation-form">
          <h5>Complete your Consultation</h5>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your first name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your last name"
                />
              </div>
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

            <div className="form-group">
              <label htmlFor="location">Choose Location</label>
              <select
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a location</option>
                <option value="New York">New York</option>
                <option value="Los Angeles">Los Angeles</option>
                <option value="Chicago">Chicago</option>
                <option value="Houston">Houston</option>
                <option value="Miami">Miami</option>
              </select>
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
                I agree to receiving appointment confirmations, reminders and
                marketing communications via email and SMS messages. Msg & data
                rates may apply. Msg frequency varies. Reply HELP for help and
                STOP to cancel. View our <a href="/#">Privacy Policy</a>
              </label>
            </div>

            <input type="hidden" name="areas" value={formData.areas} />
            <input
              type="hidden"
              name="conditions"
              value={formData.conditions}
            />

            <div className="form-actions">
              <button
                type="submit"
                className="area-button"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "SEE RESULTS"}
              </button>
            </div>
          </form>
        </div>
      );
    }

    if (showConsultationSummary && selectedBodyParts.length > 0) {
      return (
        <div className="selected-body-conditions">
          <div className="ff">
            <h3 className="quiz-card-header-text">Your Selections</h3>
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
                        <span
                          className="delete-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCondition(item.area.id, condition.id);
                          }}
                        >
                          &times;
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-conditions">No conditions selected</p>
                )}
              </div>
            ))}
          </div>
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
      );
    }

    if (currentArea) {
      return (
        <div className="condition-container">
          {isLoading ? (
            <div className="loading-spinner">
              <Spinner />
            </div>
          ) : (
            <>
              <ConditionDisplay
                bodypart={currentArea.name}
                conditions={conditions} // Ensure this is always an array
                onSelect={handleConditionSelect}
                selectedConditions={getSelectedConditionsForCurrentArea()}
              />

              {conditions.length > 0 && (
                <button
                  onClick={handleAddToConsultation}
                  className="area-button"
                >
                  ADD CONCERNS
                </button>
              )}
            </>
          )}
        </div>
      );
    }

    return (
      <div className="start">
        <h3 className="quiz-card-header-text">Your Selections</h3>
        <span className="quiz-card-desc-text">
          Start your quiz by clicking on a body part you want to be treated.
        </span>
      </div>
    );
  };

  return (
    <>
      {!submittedData && (
        <div className="quiz-main-grid">
          <div className="view-toggle-container">
            <div className="button-toggles">
              {renderGenderToggle()}
              {renderBodyToggle()}
            </div>

            {/* <AreaSelection
              areasResponse={areasResponse}
              onSelect={handleAreaSelect}
              selectedAreas={selectedAreas}
              isLoading={isLoading}
              showFrontView={showFrontView}
              showBackView={showBackView}
              showFaceView={showFaceView}
            /> */}
            <BodyMapSVG
              viewType={
                showFrontView ? "front" : showBackView ? "back" : "face"
              }
              selectedAreas={selectedAreas.map((a) => a.name)}
              onAreaSelect={(areaName) => {
                if (Array.isArray(areasResponse)) {
                  const area = findAreaByName(areasResponse, areaName);
                  if (area) handleAreaSelect(area);
                }
              }}
              showFrontView={showFrontView}
              showBackView={showBackView}
              showFaceView={showFaceView}
              gender={gender}
            />
          </div>

          <div className="selection-panel">{renderSelectionPanelContent()}</div>
        </div>
      )}

      {submittedData && (
        <ServiceRecommendation
          selectedBodyParts={selectedBodyParts}
          resetQuiz={resetQuiz}
        />
      )}
    </>
  );
};

export default BodyQuiz;
