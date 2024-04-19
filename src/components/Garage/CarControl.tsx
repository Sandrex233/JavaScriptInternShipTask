import React, { useCallback, useEffect, useState } from 'react';
import './Car.css';
import { CarStatus } from '../../utils/GlobalInterfaces.ts';

type CarControlProps = {
  onStartEngine: () => void;
  onStopEngine: () => void;
  onSwitchToDriveMode: () => void;
  raceStarted: boolean | undefined;
};

const CarControl: React.FC<CarControlProps> = ({
  onStartEngine,
  onStopEngine,
  onSwitchToDriveMode,
  raceStarted,
}) => {
  const [status, setStatus] = useState<CarStatus>(CarStatus.Stopped);

  const handleSwitchToDrive = useCallback(() => {
    if (status !== CarStatus.Drive) {
      setStatus(CarStatus.Drive);
      onSwitchToDriveMode();
    }
  }, [onSwitchToDriveMode, status]);

  const handleStartEngine = useCallback(() => {
    if (status === CarStatus.Stopped) {
      setStatus(CarStatus.Started);
      onStartEngine();
      handleSwitchToDrive();
    }
  }, [handleSwitchToDrive, onStartEngine, status]);

  const handleStopEngine = useCallback(() => {
    if (status !== CarStatus.Stopped) {
      setStatus(CarStatus.Stopped);
      onStopEngine();
    }
  }, [onStopEngine, status]);

  useEffect(() => {
    if (raceStarted === true) {
      handleStartEngine();
      handleSwitchToDrive();
    } else if (raceStarted === false) {
      handleStopEngine();
    }
  }, [handleStartEngine, handleStopEngine, handleSwitchToDrive, raceStarted]);

  return (
    <div className="buttons">
      <button type="button" onClick={handleStartEngine} disabled={status === CarStatus.Drive || status === CarStatus.Started}>A</button>
      <button type="button" onClick={handleStopEngine} disabled={status === CarStatus.Stopped}>B</button>
    </div>
  );
};

export default CarControl;
