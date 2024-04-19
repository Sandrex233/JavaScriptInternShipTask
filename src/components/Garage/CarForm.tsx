import React, { useState } from 'react';
import { createCar, updateCar } from '../../api/carService.ts';
import { Car } from '../../utils/GlobalInterfaces.ts';

interface CarFormProps {
  cars: Car[];
  setCars: React.Dispatch<React.SetStateAction<Car[]>>;
  setTotalCount: React.Dispatch<React.SetStateAction<number>>;
  updateMode: boolean;
  carId: number | undefined;
  setCarId: React.Dispatch<React.SetStateAction<number | undefined>> | undefined;
}

const CarForm: React.FC<CarFormProps> = ({
  cars, setCars, setTotalCount, updateMode, carId, setCarId,
}) => {
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');
  const [showError, setShowError] = useState<boolean>(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !color.trim()) {
      return;
    }

    if (updateMode && carId === undefined) {
      setShowError(true);
      return;
    }

    if (updateMode) {
      await updateCar(carId!, { name, color });
      const updatedCars = cars.map((car) => (car.id === carId ? { ...car, name, color } : car));
      setCars(updatedCars);
      setCarId!(undefined);
    } else {
      const newCar = await createCar(name, color);
      setTotalCount((prevTotalCount) => prevTotalCount + 1);
      setCars([...cars, newCar]);
    }

    setName('');
    setColor('#000000');
    setShowError(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="carName">
        Name:
        <input id="carName" type="text" value={name} onChange={handleNameChange} required />
      </label>
      <label htmlFor="carColor">
        Color:
        <input id="carColor" type="color" value={color} onChange={handleColorChange} required />
      </label>
      {updateMode && carId === undefined && showError && (
        <p style={{ color: 'red' }}>Please select a car to update.</p>
      )}
      <button type="submit">{updateMode ? 'Update Car' : 'Create Car'}</button>
    </form>
  );
};

export default CarForm;
