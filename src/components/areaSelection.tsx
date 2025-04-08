import React from "react";
import "./areaSelection.css";

interface Area {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  children: Area[];
}

interface ApiError {
  message: string;
}

type AreasResponse = Area[] | ApiError;

interface AreaSelectionProps {
  areasResponse: AreasResponse;
  onSelect: (area: Area) => void;
  selectedAreas: Area[];
  isLoading?: boolean;
  showFrontView: boolean;
}

const AreaSelection: React.FC<AreaSelectionProps> = ({
  areasResponse,
  onSelect,
  selectedAreas,
  isLoading = false,
  showFrontView,
}) => {
  const [message, setMessage] = React.useState<string | null>(null);

  const getChildAreas = (): Area[] => {
    if (isLoading) return [];
    if (!Array.isArray(areasResponse)) return [];
    if (areasResponse.length < 2) return [];

    const parentArea = showFrontView ? areasResponse[1] : areasResponse[0];
    return parentArea?.children || [];
  };

  const childAreas = React.useMemo(
    () => getChildAreas(),
    [areasResponse, showFrontView, isLoading, getChildAreas]
  );

  const handleAreaClick = (area: Area) => {
    if (area.count === 0) {
      setMessage(`No conditions available for ${area.name}.`);
    } else {
      setMessage(null);
      onSelect(area);
    }
  };

  if (isLoading) {
    return (
      <div className="area-selection-loading">
        <div className="loading-animation"></div>
        <p>Loading body areas...</p>
      </div>
    );
  }

  if (!Array.isArray(areasResponse)) {
    return (
      <div className="area-selection-error">
        <div className="error-icon">!</div>
        <p className="error-message">{areasResponse.message}</p>
        <button
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="area-selection-container">
      <h2 className="view-title">
        {showFrontView ? "Front of Body" : "Back of Body"}
      </h2>

      {message && <div className="info-message">{message}</div>}

      <div className="area-selection-grid">
        {childAreas.length > 0 ? (
          childAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => handleAreaClick(area)}
              className={`area-button ${
                selectedAreas.some((a) => a.id === area.id) ? "active" : ""
              }`}
            >
              <span className="area-name">{area.name}</span>
              <span className="condition-count">{area.count} conditions</span>
            </button>
          ))
        ) : (
          <div className="empty-state">
            <p>No {showFrontView ? "front" : "back"} areas available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaSelection;
