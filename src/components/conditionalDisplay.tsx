import { Condition } from "../types";

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
    return <div className="condition-display">No conditions available</div>;
  }

  return (
    <div className="condition-display">
      <div className="condition-list">
        {conditions.map((condition) => (
          <div
            key={condition.id}
            className={`condition-card ${
              selectedConditions.some((c) => c.id === condition.id)
                ? "active"
                : ""
            }`}
            onClick={() => onSelect(condition)}
          >
            <h3>{condition.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionDisplay;
