import { Condition } from "../types";
import "./conditionalDisplay.css";

interface ConditionDisplayProps {
  conditions: Condition[];
  onSelect: (condition: Condition) => void;
  selectedConditions: Condition[];
}

const ConditionDisplay: React.FC<ConditionDisplayProps> = ({
  conditions,
  onSelect,
  selectedConditions,
}) => {
  if (conditions.length === 0) {
    return (
      <div className="condition-empty-state">
        No conditions found for this area
      </div>
    );
  }

  return (
    <div className="condition-container">
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
              {/* {selectedConditions.some((c) => c.id === condition.id) && (
                <div className="selected-indicator">✓</div>
              )} */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionDisplay;
