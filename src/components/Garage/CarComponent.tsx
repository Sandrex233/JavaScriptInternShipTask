import React, { useState } from 'react';
import { Car } from '../../utils/GlobalInterfaces.ts';
import CarSVGComponent from '../CarSVG.tsx';
import {
  deleteCar, startEngine, stopEngine, switchToDriveMode,
} from '../../api/apiService.ts';
import CarControl from './CarControl.tsx';
import './Car.css';

interface CarComponentProps {
  cars: Car[];
  setCarId: (carId: number) => void;
}

const CarComponent: React.FC<CarComponentProps> = ({
  cars,
  setCarId,
}) => {
  const [raceStarted, setRaceStarted] = useState<boolean>(false);

  const startRace = () => {
    setRaceStarted(true);
    // Simulate race end after 5 seconds
    setTimeout(() => {
      setRaceStarted(false);
    }, 5000);
  };

  const handleStartEngine = async (carId: number) => {
    await startEngine(carId);
  };

  const handleStopEngine = async (carId: number) => {
    await stopEngine(carId);
  };

  const handleSwitchToDriveMode = async (carId: number) => {
    await switchToDriveMode(carId);
  };

  const handleRemoveCar = async (id: number) => {
    await deleteCar(id);
  };

  const handleSelectCar = (selectedCarId: number): void => {
    setCarId(selectedCarId);
  };

  return (
    <ul className="car">
      {cars.map((car) => (
        <li key={car.id} className="car-item">
          <div className="car-details">
            <div className="car-controls">
              <button type="button" onClick={startRace}>Start Race</button>
              <div className="buttons">
                <button className="control-button" type="button" onClick={() => car.id !== undefined && handleSelectCar(car.id)}>Select</button>
                <button className="control-button" type="button" onClick={() => car.id !== undefined && handleRemoveCar(car.id)}>Remove</button>
              </div>
              <CarControl
                onStartEngine={() => car.id !== undefined && handleStartEngine(car.id)}
                onStopEngine={() => car.id !== undefined && handleStopEngine(car.id)}
                onSwitchToDriveMode={() => car.id !== undefined && handleSwitchToDriveMode(car.id)}
              />
            </div>
            <div className={`car-info ${raceStarted ? 'animated-car' : ''}`}>
              <CarSVGComponent fill={car.color} />
              <strong>{car.name.toUpperCase()}</strong>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CarComponent;
