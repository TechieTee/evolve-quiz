import { useState, useEffect } from 'react';
import AreaSelection from './areaSelection';
import ServiceRecommendations from './serviceRecommendations';
import ConditionDisplay from './conditionalDisplay';
import './BodyQuiz.css';
import { Area, AreasResponse, Condition } from '../types/types';

const BodyQuiz = () => {
  const [areasResponse, setAreasResponse] = useState<AreasResponse>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFrontView, setShowFrontView] = useState(true);

  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://evolve.local/wp-json/wp-evolve-body-quiz/v1/areas');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch areas');
      }

      const data = await response.json() as Area[];
      setAreasResponse(data);
      setShowFrontView(data[0]?.count > 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setAreasResponse({ message: errorMessage });
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConditions = async (areaId: number) => {
    try {
      const response = await fetch(
        `http://evolve.local/wp-json/wp-evolve-body-quiz/v1/conditions?area=${areaId}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch conditions');
      
      const data = await response.json() as Condition[];
      setConditions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conditions');
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
    setSelectedCondition(null);
    setShowFrontView(area.count > 0);
  };

  const toggleView = () => {
    setShowFrontView(!showFrontView);
  };

  if (isLoading) return <div className="loading-spinner">Loading quiz data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="evolve-quiz-container">
      <h1 className="quiz-card-header-text">Begin Your Treatment Journey</h1>
      
      <div className="view-toggle-container">
        <button 
          onClick={toggleView}
          className={`view-toggle ${showFrontView ? 'active' : ''}`}
        >
          {showFrontView ? 'Show Back View' : 'Show Front View'}
        </button>
      </div>
      
      <AreaSelection
        areasResponse={areasResponse}
        onSelect={handleAreaSelect}
        selectedArea={selectedArea}
        isLoading={isLoading}
        showFrontView={showFrontView}
      />
      
      {selectedArea && (
        <ConditionDisplay
          conditions={conditions}
          onSelect={setSelectedCondition}
          selectedCondition={selectedCondition}
        />
      )}
      
      {selectedCondition && (
        <ServiceRecommendations services={selectedCondition.recommended_services} />
      )}
    </div>
  );
};

export default BodyQuiz;