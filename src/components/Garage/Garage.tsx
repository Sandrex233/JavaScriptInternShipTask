import React, { useEffect, useState } from 'react';
import { Car } from '../../utils/GlobalInterfaces.ts';
import {
  createCar, createRandomCars, deleteCar, fetchCars, updateCar,
} from '../../api/apiService.ts';
import UpdateCarForm from './UpdateCarForm.tsx';

const Garage: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');
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

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await createCar(name, color);
  };

  const handleUpdateCar = async (id: number, updatedName: string, updatedColor: string) => {
    await updateCar(id, { name: updatedName, color: updatedColor });
  };

  const handleRemoveCar = async (id: number) => {
    await deleteCar(id);
  };

  const handleSelectCar = (selectedCarId: number): void => {
    setCarId(selectedCarId);
  };

  return (
    <div>
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

      <form onSubmit={handleSubmit}>
        <label htmlFor="carName">
          Name:
          <input id="carName" type="text" value={name} onChange={handleNameChange} />
        </label>
        <label htmlFor="carColor">
          Color:
          <input id="carColor" type="color" value={color} onChange={handleColorChange} />
        </label>
        <button type="submit">Create Car</button>
      </form>

      <UpdateCarForm
        onUpdateCar={(updatedName, updatedColor) => {
          if (carId !== undefined) {
            handleUpdateCar(carId, updatedName, updatedColor);
          }
        }}
      />
      <ul>
        {cars.map((car) => (
          <li key={car.id}>
            <strong>{car.name.toUpperCase()}</strong>
            {' '}
            -
            {car.color}
            <button type="button" onClick={() => car.id !== undefined && handleSelectCar(car.id)}>Select</button>
            <button type="button" onClick={() => car.id !== undefined && handleRemoveCar(car.id)}>Remove</button>
          </li>
        ))}
      </ul>
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
