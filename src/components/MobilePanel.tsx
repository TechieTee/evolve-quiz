import { useState, useEffect } from "react";

interface MobilePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobilePanel: React.FC<MobilePanelProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const [panelOpen, setPanelOpen] = useState(isOpen);

  useEffect(() => {
    setPanelOpen(isOpen);
  }, [isOpen]);

  const handleToggle = () => {
    setPanelOpen(!panelOpen);
    if (panelOpen) {
      onClose();
    }
  };

  if (typeof window === "undefined" || window.innerWidth > 768) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`panel-overlay ${panelOpen ? "open" : ""}`}
        onClick={handleToggle}
      />
      <div className={`selection-panel ${panelOpen ? "open" : ""}`}>
        <div className="panel-toggle" onClick={handleToggle}>
          <div className="toggle-handle">&times;</div>
        </div>
        {children}
      </div>
    </>
  );
};

export default MobilePanel;
