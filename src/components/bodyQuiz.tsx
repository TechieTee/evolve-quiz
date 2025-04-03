import { useState, useEffect } from 'react';
import AreaSelection from './areaSelection';
import ServiceRecommendations from './serviceRecommendations';
import ConditionDisplay from './conditionalDisplay';
import './bodyQuiz.css';
import { Area, AreasResponse, Condition } from '../types/types';

const BodyQuiz = () => {
  const [areasResponse, setAreasResponse] = useState<AreasResponse>([]);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFrontView, setShowFrontView] = useState(true);
  const [showConsultationSummary, setShowConsultationSummary] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    area: '',
    condition: ''
  });

  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://evolvequizdev.wpengine.com/wp-json/wp-evolve-body-quiz/v1/areas', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include' 
      });
      
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
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://evolvequizdev.wpengine.com/wp-json/wp-evolve-body-quiz/v1/conditions?area=${areaId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include' 
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch conditions');
      }
      
      const data = await response.json() as Condition[];
      setConditions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conditions';
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
    setSelectedCondition(null);
    setShowFrontView(area.count > 0);
    setShowConsultationSummary(false);
    setSubmittedData(null);
  };

  const toggleView = () => {
    setShowFrontView(!showFrontView);
  };

  const handleAddToConsultation = () => {
    setShowConsultationSummary(true);
  };

  const handleOpenForm = () => {
    setShowForm(true);
    setSubmittedData(null);
  };

  // Update form data when area or condition changes
  useEffect(() => {
    if (selectedArea && selectedCondition) {
      setFormData(prev => ({
        ...prev,
        area: selectedArea.name,
        condition: selectedCondition.title
      }));
    }
  }, [selectedArea, selectedCondition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionDate = new Date().toLocaleString();
    setSubmittedData({
      ...formData,
      date: submissionDate
    });
    setShowForm(false);
    setShowConsultationSummary(false);
  };

  if (isLoading) return <div className="loading-spinner">Loading quiz data...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="evolve-quiz-container">
      <h1 className="quiz-card-header-text">Begin Your Treatment Journey</h1>
      
      {!submittedData && (
        <>
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

          {selectedCondition && !showConsultationSummary && !showForm && !submittedData && (
            <div style={{display:'flex', alignItems:'center',justifyContent:'center'}}> 
              <button
                onClick={handleAddToConsultation}
                className="area-button"
              >
                Add to my consultation
              </button>
            </div>
          )}
          
          {showConsultationSummary && selectedArea && selectedCondition && !showForm && !submittedData && (
            <div className="consultation-summary">
              <h3>Consultation Summary</h3>
              <p><strong>Body Part:</strong> {selectedArea.name}</p>
              <p><strong>Condition:</strong> {selectedCondition.title}</p>
              <button 
                onClick={handleOpenForm}
                className="consultation-form-button"
              >
                Proceed to Consultation Form
              </button>
            </div>
          )}

          {showForm && (
            <div className="consultation-form">
              <div className="form-container">
                <h3>Your Consultation Form</h3>
                <p>For {selectedArea?.name} - {selectedCondition?.title}</p>
                
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
                  <input type="hidden" name="condition" value={formData.condition} />
                  
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
                      {isLoading ? 'Submitting...' : 'Submit Consultation'}
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
              <span className="data-label">Condition:</span>
              <span className="data-value">{submittedData.condition}</span>
            </div>
          </div>
          <div className="card-footer">
            <button 
              className="primary-button"
              onClick={() => {
                setSubmittedData(null);
                setSelectedArea(null);
                setSelectedCondition(null);
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
  );
};

export default BodyQuiz;