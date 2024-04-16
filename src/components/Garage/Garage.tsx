import React, { useEffect, useState } from 'react';
import { Car } from '../../utils/GlobalInterfaces.ts';
import {
  createRandomCars, fetchCars,
  updateCar,
} from '../../api/apiService.ts';
import UpdateCarForm from './UpdateCarForm.tsx';
import CarComponent from './CarComponent.tsx';
import CreateCarForm from './CreateCarForm.tsx';
import './Car.css';

const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [carId, setCarId] = useState<number>();

  useEffect(() => {
    fetchCars(page, 7)
      .then((fetchedCars) => {
        setCars(fetchedCars.cars);
        setTotalCount(fetchedCars.totalCount);
      })
      .catch((error) => {
        throw error;
      });
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
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

  return (
    <div className="container">
      <h2>Garage</h2>
      <button type="button" onClick={handleGenerateRandomCars}>
        Generate 100 Random Cars
      </button>
      <button type="button" onClick={handlePreviousPage} disabled={page === 1}>
        Previous Page
      </button>
      <button type="button" onClick={handleNextPage}>
        Next Page
      </button>

      <CreateCarForm />
      <UpdateCarForm
        onUpdateCar={(updatedName, updatedColor) => {
          if (carId !== undefined) {
            handleUpdateCar(carId, updatedName, updatedColor);
          }
        }}
      />
      <CarComponent
        cars={cars}
        setCarId={setCarId}
      />
      <p>
        count:
        {totalCount}
      </p>
      <p>
        Page
        {page}
      </p>
    </div>
  );
};

export default Garage;
