import { useState, useEffect } from 'react';
import AreaSelection from './areaSelection';
import ServiceRecommendations from './serviceRecommendations';
import ConditionDisplay from './conditionalDisplay';
import './BodyQuiz.css'; // Create this CSS file for styling

interface Area {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  children: Area[];
}

interface Condition {
  id: string;
  title: string;
  link: string;
  recommended_services: {
    id: string;
    title: string;
    link: string;
    taxonomy: { id: string; name: string }[];
  }[];
}

interface ApiError {
  message: string;
}

type AreasResponse = Area[] | ApiError;

const BodyQuiz = () => {
  const [areasResponse, setAreasResponse] = useState<AreasResponse>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<Condition | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFrontView, setShowFrontView] = useState(true);

  // Fetch areas on component mount
  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://evolve.local/wp-json/wp-evolve-body-quiz/v1/areas');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch areas');
        }

        const data: Area[] = await response.json();
        setAreasResponse(data);
        
        // Determine initial view based on first area's count
        if (data.length > 0) {
          setShowFrontView(data[0].count > 0);
        }
      } catch (err) {
        setAreasResponse({ message: err instanceof Error ? err.message : 'Unknown error' });
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreas();
  }, []);

  // Fetch conditions when area is selected
  useEffect(() => {
    if (!selectedArea) return;

    const fetchConditions = async () => {
      try {
        const response = await fetch(
          `http://evolve.local/wp-json/wp-evolve-body-quiz/v1/conditions?area=${selectedArea.id}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch conditions');
        }

        const data: Condition[] = await response.json();
        setConditions(data);
     
        data.forEach(condition => {
          condition.recommended_services.forEach(service => {
            service.taxonomy.forEach(taxonomy => {
              console.log(taxonomy.name, 'Conditions 1');
            });
          });
        });
        // console.log(data, 'Conditions 2');
        // console.log(data, 'Conditions 3');
        // console.log(data, 'Conditions 4');
        // console.log(data, 'Conditions 5');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conditions');
      }
    };

    fetchConditions();
  }, [selectedArea]);

  const handleAreaSelect = (area: Area) => {
    setSelectedArea(area);
    setSelectedCondition(null);
    setShowFrontView(area.count > 0);
  };

  const toggleView = () => {
    setShowFrontView(!showFrontView);
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading quiz data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

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
          onSelect={(condition: Condition) => setSelectedCondition(condition)}
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