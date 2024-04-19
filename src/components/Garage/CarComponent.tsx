import React, { CSSProperties, useState } from 'react';
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
  // let carValues: {[key: number]: number} = {};
  let distance: number;
  const [carVelocities, setCarVelocities] = useState<{ [key: number]: number }>({});

  const handleStartEngine = async (carId: number) => {
    await startEngine(carId).then((res) => {
      // carValues = {
      //   ...carValues,
      //   [carId]: res.velocity,
      // };
      const newVelocity = res.velocity;
      setCarVelocities((prevVelocities) => ({
        ...prevVelocities,
        [carId]: newVelocity,
      }));
      distance = res.distance;
    });

    if (raceStarted === true) {
      if (cars.length === Object.keys(carVelocities).length) {
        let bestCarId: number = 1;
        let bestVelocity: number = 0;
        Object.keys(carVelocities).forEach((carIdStr) => {
          const cId: number = parseInt(carIdStr, 10);
          const velocity: number = carVelocities[cId];
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
      {cars.map((car) => {
        const animationDuration: string | false = car.id !== undefined && `${1000 / carVelocities[car.id]}s`;
        const animationStyle: CSSProperties = animationDuration && raceStarted ? {
          animation: `drive ${animationDuration && animationDuration} linear forwards`,
        } : {};
        return (
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
                  onSwitchToDriveMode={
                    () => car.id !== undefined && handleSwitchToDriveMode(car.id)
                  }
                  raceStarted={raceStarted}
                />
              </div>
              <div
                className="car-info"
              >
                <div
                  style={animationStyle}
                >
                  <CarSVGComponent fill={car.color} />
                </div>
                <strong>{car.name.toUpperCase()}</strong>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default CarComponent;
