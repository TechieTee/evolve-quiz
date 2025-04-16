import React, { useState } from "react";
import { bodyAreas } from "./bodyAreaPaths";
import "./BodyMapSVG.css";

interface BodyMapSVGProps {
  viewType: "front" | "back" | "face";
  selectedAreas: string[];
  onAreaSelect: (area: string) => void;
  showFrontView: boolean;
  showBackView: boolean;
  showFaceView: boolean;
}

const BodyMapSVG: React.FC<BodyMapSVGProps> = ({
  viewType,
  selectedAreas,
  onAreaSelect,
}) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  // const [message, setMessage] = useState<string | null>(null);

  const getAreasForView = () => {
    switch (viewType) {
      case "front":
        return bodyAreas.front;
      case "back":
        return bodyAreas.back;
      case "face":
        return bodyAreas.head;
      default:
        return bodyAreas.front;
    }
  };

  const areas = getAreasForView();

  const getBodyImage = () => {
    switch (viewType) {
      case "front":
        return "/body-front.svg";
      case "back":
        return "/body-back.svg";
      case "face":
        return "/face.svg";
      default:
        return "/body-front.svg";
    }
  };

  const handleAreaClick = (area: string) => {
    // Check if area has conditions (you might want to add this data to bodyAreas)
    const areaData = areas.find((a) => a.area === area);
    if (!areaData) return;

    // If you had condition count data, you could do:
    // if (areaData.count === 0) {
    //   setMessage(`No conditions available for ${area}.`);
    // } else {
    //   setMessage(null);
    onAreaSelect(area);
    // }
  };

  return (
    <div className="body-map-svg-container">
      {/* {message && <div className="info-message">{message}</div>} */}

      <svg
        viewBox="0 0 187 733"
        className="body-svg"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background image */}
        <image
          href={getBodyImage()}
          width="187"
          height="733"
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Interactive areas */}
        {areas.map((area) => (
          <path
            key={area.area}
            d={area.path}
            className={`body-area-path ${
              selectedAreas.includes(area.area) ? "selected" : ""
            } ${hoveredArea === area.area ? "hovered" : ""}`}
            onClick={() => handleAreaClick(area.area)}
            onMouseEnter={() => setHoveredArea(area.area)}
            onMouseLeave={() => setHoveredArea(null)}
          />
        ))}

        {/* Visual indicators for selected areas */}
        {areas
          .filter((a) => selectedAreas.includes(a.area))
          .map((area) => (
            <path
              key={`selected-${area.area}`}
              d={area.path}
              className="selected-area-indicator"
            />
          ))}

        {/* Tooltip */}
        {hoveredArea && (
          <text
            x={
              (parseFloat(
                areas.find((a) => a.area === hoveredArea)?.left || "0"
              ) /
                100) *
              187
            }
            y={
              (parseFloat(
                areas.find((a) => a.area === hoveredArea)?.top || "0"
              ) /
                100) *
                733 -
              10
            }
            className="area-tooltip"
          >
            {hoveredArea}
          </text>
        )}
      </svg>
    </div>
  );
};

export default BodyMapSVG;
