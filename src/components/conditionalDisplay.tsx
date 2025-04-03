


interface Condition {
  id: string;
  title: string;
  link: string;
}

interface ConditionDisplayProps {
  conditions: Condition[];
  onSelect: (condition: Condition) => void;
  selectedCondition?: Condition;
}

const ConditionDisplay: React.FC<ConditionDisplayProps> = ({ conditions, onSelect, selectedCondition }) => {
  return (
    <div className="condition-display">
      <h2>Select a Condition</h2>
      <div className="condition-list">
        {conditions.map((condition) => (
          <div 
            key={condition.id}
            className={`condition-card ${selectedCondition?.id === condition.id ? 'active' : ''}`}
            onClick={() => onSelect(condition)}
          >
            <h3>{condition.title}</h3>
            <a href={condition.link} target="_blank" rel="noopener noreferrer">
              Learn more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionDisplay;