import generateRandomCar from '../utils/GenerateRandomCars.ts';
import { Car } from '../utils/GlobalInterfaces.ts';
import BASE_URL from './apiBaseUrl.ts';

export const getCar = async (id: number): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch car with ID ${id}`);
  }

  const car = await response.json();
  return car;
};

export const createRandomCars = async (): Promise<Car> => {
  const newCars = generateRandomCar();
  return fetch(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newCars),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to create cars');
      }
      return newCars;
    })
    .catch((error) => {
      throw error;
    });
};

export const fetchCars = async (
  page: number,
  limit: number,
): Promise<{ cars: Car[]; totalCount: number }> => {
  const response = await fetch(
    `${BASE_URL}/garage?_page=${page}&_limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch cars');
  }

  const totalCountHeader = response.headers.get('X-Total-Count');
  const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;

  const cars: Car[] = await response.json();
  return { cars, totalCount };
};

export const createCar = async (name: string, color: string): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, color }),
  });

  if (!response.ok) {
    throw new Error('Failed to create car');
  }

  return response.json();
};

export const updateCar = async (
  id: number,
  updatedCar: Car,
): Promise<Car | Error> => {
  try {
    const response = await fetch(`${BASE_URL}/garage/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedCar),
    });
    return response.json();
  } catch (e) {
    return e as Error;
  }
};

export const deleteCar = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete car');
  }
};
