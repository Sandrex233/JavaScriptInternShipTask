import React, { useCallback, useEffect, useState } from 'react';
import { Car } from '../../utils/GlobalInterfaces.ts';
import CarComponent from './CarComponent.tsx';
import './Car.css';
import Pagination from '../Pagination.tsx';
import { createRandomCars, fetchCars } from '../../api/carService.ts';
import CarForm from './CarForm.tsx';
import useAppContext from '../../context/useAppContext.ts';

const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [carId, setCarId] = useState<number | undefined>();
  const [raceStarted, setRaceStarted] = useState<boolean | undefined>(undefined);
  const updateMode: boolean = true;

  const {
    garagePages, setGaragePages,
    createCarName, setCreateCarName,
    createCarColor, setCreateCarColor,
    updateCarName, setUpdateCarName,
    updateCarColor, setUpdateCarColor,
  } = useAppContext();

  const fetchCarsCallback = useCallback(async (cPage: number) => {
    fetchCars(cPage, 7).then((fetchedCars) => {
      setCars(fetchedCars.cars);
      setTotalCount(fetchedCars.totalCount);
    })
      .catch((error) => {
        throw error;
      });
  }, []);

  useEffect(() => {
    fetchCarsCallback(garagePages);
  }, [garagePages, fetchCarsCallback]);

  const handlePreviousPage = () => {
    if (garagePages > 1) {
      setGaragePages((prevPage: number) => prevPage - 1);
      setRaceStarted(undefined);
    }
  };

  const handleNextPage = () => {
    setGaragePages((prevPage: number) => prevPage + 1);
    setRaceStarted(undefined);
  };

  const handleGenerateRandomCars = async (): Promise<void> => {
    const promises: Promise<Car>[] = [];
    for (let i = 0; i < 100; i += 1) {
      promises.push(createRandomCars());
    }
    Promise.all(promises)
      .then(() => {
        fetchCars(garagePages, 7)
          .then((fetchedCars) => {
            setCars(fetchedCars.cars);
            setTotalCount(fetchedCars.totalCount);
          })
          .catch((error) => {
            throw error;
          });
      })
      .catch((error) => {
        throw error;
      });
  };

  const startRace = () => {
    if (raceStarted === false || raceStarted === undefined) {
      setRaceStarted(true);
      setTimeout(() => {
        setRaceStarted(false);
      }, 10000);
    }
  };

  const resetRace = () => {
    if (raceStarted === true || raceStarted !== undefined) setRaceStarted(false);
  };

  return (
    <div className="container">
      <h2>Garage</h2>
      <button type="button" onClick={handleGenerateRandomCars}>
        Generate 100 Random Cars
      </button>
      <CarForm
        cars={cars}
        setCars={setCars}
        setTotalCount={setTotalCount}
        updateMode={!updateMode}
        carId={undefined}
        setCarId={undefined}
        name={createCarName}
        setName={setCreateCarName}
        color={createCarColor}
        setColor={setCreateCarColor}
      />
      <CarForm
        cars={cars}
        setCars={setCars}
        setTotalCount={setTotalCount}
        updateMode={updateMode}
        carId={carId}
        setCarId={setCarId}
        name={updateCarName}
        setName={setUpdateCarName}
        color={updateCarColor}
        setColor={setUpdateCarColor}
      />
      <button type="button" onClick={startRace}>Race</button>
      <button type="button" onClick={resetRace}>Reset</button>
      <CarComponent
        cars={cars}
        setCars={setCars}
        setTotalCount={setTotalCount}
        setCarId={setCarId}
        raceStarted={raceStarted}

      />
      <p>
        Total Cars:
        {totalCount}
      </p>
      <Pagination
        currentPage={garagePages}
        totalPages={Math.round(totalCount / 7)}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default Garage;
