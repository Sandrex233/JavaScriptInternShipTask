import React, { useRef } from 'react';
import { Car } from '../../utils/GlobalInterfaces.ts';
import CarSVGComponent from '../CarSVG.tsx';
import {
  createWinner,
  deleteCar, startEngine, stopEngine, switchToDriveMode,
} from '../../api/apiService.ts';
import CarControl from './CarControl.tsx';
import './Car.css';

interface CarComponentProps {
  cars: Car[];
  setCarId: React.Dispatch<React.SetStateAction<number | undefined>>;
  raceStarted: boolean | undefined;
}

const CarComponent: React.FC<CarComponentProps> = ({
  cars,
  setCarId,
  raceStarted,
}) => {
  const carRefs = useRef<HTMLDivElement[]>([]);

  let carValues: {[key: number]: number} = {};
  let distance: number;

  const handleStartEngine = async (carId: number) => {
    await startEngine(carId).then((res) => {
      carValues = {
        ...carValues,
        [carId]: res.velocity,
      };
      distance = res.distance;
    });

    if (raceStarted === true) {
      if (cars.length === Object.keys(carValues).length) {
        let bestCarId: number = 1;
        let bestVelocity: number = 0;
        Object.keys(carValues).forEach((carIdStr) => {
          const cId: number = parseInt(carIdStr, 10);
          const velocity: number = carValues[cId];
          if (velocity > bestVelocity) {
            bestVelocity = velocity;
            bestCarId = cId;
          }
        });
        await createWinner({
          id: bestCarId,
          wins: 1,
          time: parseFloat(((distance / bestVelocity) / 1000).toFixed(2)),
        });
      }
    }
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
      {cars.map((car, index) => (
        <li key={car.id} className="car-item">
          <div className="car-details">
            <div className="car-controls">
              <div className="buttons">
                <button className="control-button" type="button" onClick={() => car.id !== undefined && handleSelectCar(car.id)}>Select</button>
                <button className="control-button" type="button" onClick={() => car.id !== undefined && handleRemoveCar(car.id)}>Remove</button>
              </div>
              <CarControl
                onStartEngine={() => car.id !== undefined && handleStartEngine(car.id)}
                onStopEngine={() => car.id !== undefined && handleStopEngine(car.id)}
                onSwitchToDriveMode={() => car.id !== undefined && handleSwitchToDriveMode(car.id)}
                raceStarted={raceStarted}
              />
            </div>
            <div
              ref={(el) => { if (el) carRefs.current[index] = el; }}
              className={`car-info ${(raceStarted) ? 'car-animation' : ''}`}
            >
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
