import React, {
  CSSProperties, useEffect, useState,
} from 'react';
import { Car, WinnerWithCar } from '../../../utils/GlobalInterfaces.ts';
import CarSVGComponent from '../../CarSVG.tsx';
import CarControl from './CarControl.tsx';
import '../garage.css';
import { startEngine, stopEngine, switchToDriveMode } from '../../../api/engineService.ts';
import { createWinner, updateWinner } from '../../../api/winnerService.ts';
import { deleteCar, getCar } from '../../../api/carService.ts';

interface CarComponentProps {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  setCarId: React.Dispatch<React.SetStateAction<number | undefined>>;
  raceStarted: boolean | undefined;
  setWinner: React.Dispatch<React.SetStateAction<WinnerWithCar | undefined>>;
}

const CarComponent: React.FC<CarComponentProps> = ({
  cars,
  setCars,
  setTotalCount,
  setCarId,
  raceStarted,
  setWinner,
}) => {
  // let carValues: {[key: number]: number} = {};
  const [carVelocities, setCarVelocities] = useState<{ [key: number]: number }>({});
  const [distance, setDistance] = useState<number>();

  const handleStartEngine = async (carId: number) => {
    await startEngine(carId).then((res) => {
      // carValues = {
      //   ...carValues,
      //   [carId]: res.velocity,
      // };
      setCarVelocities((prevVelocities) => ({
        ...prevVelocities,
        [carId]: res.velocity,
      }));
      setDistance(res.distance);
    });
  };

  useEffect(() => {
    const raceFinished = cars.length === Object.keys(carVelocities).length;
    if (raceFinished) {
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
      if (raceStarted === false) {
        createWinner({
          id: bestCarId, wins: 1, time: parseFloat(((distance! / bestVelocity) / 1000).toFixed(2)),
        }).then(async (res) => {
          const winnerCar = await getCar(res.id);
          setWinner({ ...res, car: winnerCar });
          setTimeout(() => { setWinner(undefined); }, 5000);
        }).catch(async (error) => {
          if (error) {
            updateWinner({
              id: bestCarId,
              wins: 1,
              time: parseFloat(((distance! / bestVelocity) / 1000).toFixed(2)),
            })
              .then(async (res) => {
                const winnerCar = await getCar(res.id);
                setWinner({ ...res, car: winnerCar });
                setTimeout(() => { setWinner(undefined); }, 5000);
              });
          }
        });
        setCarVelocities({});
      }
    }
  }, [raceStarted, cars, carVelocities, distance, setWinner]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const animationDistance = screenWidth > 1000 ? 855 : screenWidth - 180;
    const root = document.documentElement;
    root.style.setProperty('--animation-distance', `${animationDistance}px`);
  }, []);

  const handleStopEngine = async (carId: number) => {
    await stopEngine(carId);
  };

  const handleSwitchToDriveMode = async (carId: number) => {
    await switchToDriveMode(carId);
  };

  const handleRemoveCar = async (id: number) => {
    await deleteCar(id);
    const updatedCars = cars.filter((car) => car.id !== id);
    setTotalCount((prevTotalCount) => prevTotalCount - 1);
    setCars(updatedCars);
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
