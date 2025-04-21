import React, { useState } from "react";
import { bodyAreas } from "./bodyAreaPaths";
import "./bodyMapSVG.css";

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
    const areaData = areas.find((a) => a.area === area);
    if (!areaData) return;
    onAreaSelect(area);
  };

  const getViewBox = () => {
    return viewType === "face" ? "0 0 400 400" : "0 0 187 733";
  };

  interface Area {
    area: string;
    left: string;
    top: string;
  }

  const calculatePosition = (area: Area) => {
    if (viewType === "face") {
      // Center the face content within the larger viewBox
      const left = (parseFloat(area.left) / 100) * 300 + 50; // 300 + 50 padding on each side
      const top = (parseFloat(area.top) / 100) * 300 + 50; // 300 + 50 padding on each side
      return { left, top };
    } else {
      const left = (parseFloat(area.left) / 100) * 187;
      const top = (parseFloat(area.top) / 100) * 733;
      return { left, top };
    }
  };

  return (
    <div className="body-map-svg-container">
      <svg
        viewBox={getViewBox()}
        className={`body-svg ${viewType === "face" ? "face-view" : ""}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background image - centered for face view */}
        <image
          href={getBodyImage()}
          width={viewType === "face" ? "300" : "187"}
          height={viewType === "face" ? "300" : "733"}
          x={viewType === "face" ? "50" : "0"} // Center horizontally for face
          y={viewType === "face" ? "50" : "0"} // Center vertically for face
          preserveAspectRatio="xMidYMid meet"
        />

        {/* Interactive areas */}
        {areas.map((area) => {
          const { left, top } = calculatePosition(area);

          return (
            <React.Fragment key={area.area}>
              <circle
                cx={left}
                cy={top}
                r={viewType === "face" ? "8" : "8"}
                className={`body-area-path ${
                  hoveredArea === area.area ? "hovered" : ""
                }`}
                onClick={() => handleAreaClick(area.area)}
                onMouseEnter={() => setHoveredArea(area.area)}
                onMouseLeave={() => setHoveredArea(null)}
              />

              {selectedAreas.includes(area.area) && (
                <circle
                  cx={left}
                  cy={top}
                  r={viewType === "face" ? "8" : "8"}
                  className="selected-area-indicator"
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Tooltip */}
        {hoveredArea && (
          <text
            x={
              calculatePosition(
                areas.find((a) => a.area === hoveredArea) || areas[0]
              ).left
            }
            y={
              calculatePosition(
                areas.find((a) => a.area === hoveredArea) || areas[0]
              ).top - 10
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
