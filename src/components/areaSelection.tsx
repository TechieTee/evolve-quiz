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
  selectedArea: Area | null;
  isLoading?: boolean;
  showFrontView: boolean;
}

const AreaSelection: React.FC<AreaSelectionProps> = ({
  areasResponse,
  onSelect,
  selectedArea,
  isLoading = false,
  showFrontView,
}) => {
  const getChildAreas = (): Area[] => {
    if (isLoading) return [];
    if (!Array.isArray(areasResponse)) return [];
    if (areasResponse.length < 2) return [];

    const parentArea = showFrontView ? areasResponse[1] : areasResponse[0];
    return parentArea?.children || [];
  };

  const childAreas = React.useMemo(
    () => getChildAreas(),
    [areasResponse, showFrontView, isLoading]
  );

  if (isLoading) {
    return (
      <div className="area-selection loading">
        <h2>Select a Body Area</h2>
        <div className="loading-spinner">Loading areas...</div>
      </div>
    );
  }

  if (!Array.isArray(areasResponse) && areasResponse?.message) {
    return (
      <div className="area-selection error">
        <h2>Select a Body Area</h2>
        <div className="error-message">{areasResponse.message}</div>
      </div>
    );
  }

  return (
    <div className="area-selection">
      <h2>Select a Condition ({showFrontView ? "Front View" : "Back View"})</h2>

      {childAreas.length > 0 ? (
        <div className="area-grid">
          {childAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => onSelect(area)}
              className={`area-button ${
                selectedArea?.id === area.id ? "active" : ""
              }`}
            >
              {area.name}
              <span className="count-badge">{area.count}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {showFrontView ? (
            <p>No front areas available</p>
          ) : (
            <p>No back areas available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AreaSelection;
