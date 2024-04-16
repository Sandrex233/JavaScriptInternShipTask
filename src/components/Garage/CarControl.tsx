import React, { useState } from 'react';
import './Car.css';

type CarControlProps = {
  onStartEngine: () => void;
  onStopEngine: () => void;
  onSwitchToDriveMode: () => void;
};

const CarControl: React.FC<CarControlProps> = ({
  onStartEngine,
  onStopEngine,
  onSwitchToDriveMode,
}) => {
  const [status, setStatus] = useState<'started' | 'stopped' | 'drive'>('stopped');

  const handleStartEngine = () => {
    setStatus('started');
    onStartEngine();
    setStatus('drive');
    onSwitchToDriveMode();
  };

  const handleStopEngine = () => {
    setStatus('stopped');
    onStopEngine();
  };

  return (
    <div className="buttons">
      <button type="button" onClick={handleStartEngine} disabled={status === 'drive'}>A</button>
      <button type="button" onClick={handleStopEngine} disabled={status === 'stopped'}>B</button>
    </div>
  );
};

export default CarControl;
