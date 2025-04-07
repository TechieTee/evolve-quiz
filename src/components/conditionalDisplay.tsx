import { Condition } from "../types/types";
import "./conditionalDisplay.css";

interface ConditionDisplayProps {
  conditions: Condition[];
  onSelect: (condition: Condition) => void;
  selectedConditions: Condition[];
  bodypart: string;
}

const ConditionDisplay: React.FC<ConditionDisplayProps> = ({
  conditions,
  bodypart,
  onSelect,
  selectedConditions,
}) => {
  if (conditions.length === 0) {
    return <div className="condition-empty-state">data...</div>;
  }

  return (
    <div className="condition-container">
      <h3>Select {bodypart} Concerns</h3>
      <div className="condition-grid">
        {conditions.map((condition) => (
          <div
            key={condition.id}
            className={`condition-item ${
              selectedConditions.some((c) => c.id === condition.id)
                ? "selected"
                : ""
            }`}
            onClick={() => onSelect(condition)}
          >
            <div className="condition-content">
              <h3 className="condition-title">{condition.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionDisplay;
