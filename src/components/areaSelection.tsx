import React from "react";
import "./areaSelection.css";
import FrontBody from "/body-front.svg";
import BackBody from "/body-back.svg";
import Face from "/face.svg";

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
  showBackView: boolean;
  showFaceView: boolean;
}

const AreaSelection: React.FC<AreaSelectionProps> = ({
  areasResponse,
  onSelect,
  selectedAreas,
  isLoading = false,
  showFrontView,
  showBackView,
  showFaceView,
}) => {
  const [message, setMessage] = React.useState<string | null>(null);

  const getChildAreas = (): Area[] => {
    if (isLoading) return [];
    if (!Array.isArray(areasResponse)) return [];

    // Find the appropriate parent area based on current view
    let parentArea: Area | undefined;

    if (showFrontView) {
      parentArea = areasResponse.find((area) => area.slug === "front");
    } else if (showBackView) {
      parentArea = areasResponse.find((area) => area.slug === "back");
    } else if (showFaceView) {
      parentArea = areasResponse.find((area) => area.slug === "face");
    }

    return parentArea?.children || [];
  };

  const childAreas = React.useMemo(
    () => getChildAreas(),
    [areasResponse, showFrontView, showBackView, showFaceView, isLoading]
  );

  const getViewTitle = () => {
    if (showFrontView) return "Front of Body";
    if (showBackView) return "Back of Body";
    if (showFaceView) return "Face Areas";
    return "Body Areas";
  };

  const getBodyImage = () => {
    if (showFrontView) return FrontBody;
    if (showBackView) return BackBody;
    if (showFaceView) return Face;
    return FrontBody;
  };

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
      {/* <h2 className="view-title">{getViewTitle()}</h2> */}
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
              // disabled={area.count === 0}
            >
              <span className="area-name">{area.name}</span>
            </button>
          ))
        ) : (
          <div className="empty-state">
            <p>No {getViewTitle().toLowerCase()} available</p>
          </div>
        )}
      </div>

      <img
        src={getBodyImage()}
        alt={getViewTitle()}
        className={`body-image ${showFaceView ? "face-image" : ""}`}
      />
    </div>
  );
};

export default AreaSelection;
