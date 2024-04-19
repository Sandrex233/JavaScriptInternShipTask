import React, { useCallback, useEffect, useState } from 'react';
import { Car } from '../../utils/GlobalInterfaces.ts';
import {
  createRandomCars, fetchCars,
  updateCar,
} from '../../api/apiService.ts';
import UpdateCarForm from './UpdateCarForm.tsx';
import CarComponent from './CarComponent.tsx';
import CreateCarForm from './CreateCarForm.tsx';
import './Car.css';
import Pagination from '../Pagination.tsx';

const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [carId, setCarId] = useState<number | undefined>();
  const [raceStarted, setRaceStarted] = useState<boolean | undefined>(undefined);

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
    fetchCarsCallback(page);
  }, [page, fetchCarsCallback]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      setRaceStarted(undefined);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    setRaceStarted(undefined);
  };

  const handleGenerateRandomCars = async (): Promise<void> => {
    const promises: Promise<Car>[] = [];
    for (let i = 0; i < 100; i += 1) {
      promises.push(createRandomCars());
    }
    Promise.all(promises)
      .then(() => {
        fetchCars(page, 7)
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

  const handleUpdateCar = async (id: number, updatedName: string, updatedColor: string) => {
    await updateCar(id, { name: updatedName, color: updatedColor });
  };

  const startRace = () => {
    if (raceStarted === false || raceStarted === undefined) {
      setRaceStarted(true);
      if (raceStarted) {
        setTimeout(() => {
          setRaceStarted(false);
        }, 10000);
      }
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
      <CreateCarForm />
      <UpdateCarForm
        onUpdateCar={(updatedName, updatedColor) => {
          if (carId !== undefined) {
            handleUpdateCar(carId, updatedName, updatedColor);
          }
        }}
      />
      <button type="button" onClick={startRace}>Race</button>
      <button type="button" onClick={resetRace}>Reset</button>
      <CarComponent
        cars={cars}
        setCarId={setCarId}
        raceStarted={raceStarted}
      />
      <Pagination
        currentPage={page}
        totalPages={Math.round(totalCount / 7)}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default Garage;
