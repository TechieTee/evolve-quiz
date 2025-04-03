import React from 'react';
import './areaSelection.css';

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
  // Helper functions
  const getAreasArray = (response: AreasResponse): Area[] => {
    if (isLoading) return [];
    if (!response) return [];
    if (Array.isArray(response)) return response;
    return [];
  };

  const flattenAreas = (areas: Area[]): Area[] => {
    if (!Array.isArray(areas)) return [];
    return areas.reduce<Area[]>((acc, area) => {
      if (!area) return acc;
      acc.push({...area});
      if (area.children?.length) acc.push(...flattenAreas(area.children));
      return acc;
    }, []);
  };

  const areasArray = getAreasArray(areasResponse);
  const allAreas = React.useMemo(() => flattenAreas(areasArray), [areasArray]);

  // Determine if we have any back view areas (count === 0)
  const hasBackViewAreas = allAreas.some(area => area.count === 0);

  // Filter areas based on view
  const filteredAreas = React.useMemo(() => {
    if (showFrontView) {
      return allAreas.filter(area => area.count === 1);
    } else {
      // For back view, return either count=0 areas or empty array if none exist
      const backAreas = allAreas.filter(area => area.count === 0);
      return backAreas.length > 0 ? backAreas : [];
    }
  }, [allAreas, showFrontView]);

  // Loading state
  if (isLoading) {
    return (
      <div className="area-selection loading">
        <h2>Select a Body Area</h2>
        <div className="loading-spinner">Loading areas...</div>
      </div>
    );
  }

  // Error state
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
      <h2>Select a Body Area ({showFrontView ? 'Front' : 'Back'} View)</h2>
      
      {/* Show appropriate areas based on view */}
      {filteredAreas.length > 0 ? (
        <div className="area-grid">
          {filteredAreas.map(area => (
            <button
              key={area.id}
              onClick={() => onSelect(area)}
              className={`area-button ${selectedArea?.id === area.id ? 'active' : ''}`}
            >
              {area.name}
              <span className="count-badge">{area.id}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          {showFrontView ? (
            <p>No front areas available</p>
          ) : hasBackViewAreas ? (
            <p>No back areas available</p>
          ) : (
            <p>Only front view areas available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AreaSelection;