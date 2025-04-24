import { Condition } from "../types/types";
import "./conditionalDisplay.css";

interface ConditionDisplayProps {
  conditions?: Condition[] | null;
  onSelect: (condition: Condition) => void;
  selectedConditions: Condition[];
  bodypart: string;
}

const ConditionDisplay: React.FC<ConditionDisplayProps> = ({
  conditions = [],
  bodypart,
  onSelect,
  selectedConditions,
}) => {
  if (!Array.isArray(conditions) || conditions.length === 0) {
    return (
      <div className="condition-empty-state">
        No conditions available for this body part
      </div>
    );
  }

  return (
    <div className="condition-grid">
      <h3 className="concerns-header-text">{bodypart} Concerns</h3>
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
            <span className="condition-title">{condition.title}</span>
            <span
              className={`custom-checkbox ${
                selectedConditions.some((c) => c.id === condition.id)
                  ? "checked"
                  : ""
              }`}
            >
              {selectedConditions.some((c) => c.id === condition.id) && (
                <svg
                  className="check-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConditionDisplay;
