import generateRandomCar from '../utils/GenerateRandomCars.ts';
import { Car, EngineResponseDTO, WinnerWithCar } from '../utils/GlobalInterfaces.ts';

const BASE_URL = 'http://localhost:3000';

export default async function fetchWinners(
  page: number,
  limit: number,
  sort: string,
  order: string,
): Promise<WinnerWithCar[]> {
  const url = `${BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch winners');
  }

  const winners = await response.json();
  return winners;
}

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
  page: number = 1,
  limit: number = 7,
): Promise<{cars: Car[]; totalCount: number}> => {
  const response = await fetch(
    `${BASE_URL}/garage?_page=${page}&_limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch cars');
  }

  const totalCountHeader = response.headers.get('X-Total-Count');
  const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;

  const cars = await response.json();
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

export const updateCar = async (id: number, updatedCar: Car): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedCar),
  });

  if (!response.ok) {
    throw new Error('Failed to update car');
  }

  return response.json();
};

export const deleteCar = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete car');
  }
};

export const startEngine = async (id: number): Promise<EngineResponseDTO> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=started`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to start engine');
  }

  return response.json();
};

export const stopEngine = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=stopped`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to stop engine');
  }
};

export const switchToDriveMode = async (id: number): Promise<{ success: boolean }> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to switch to drive mode');
  }

  return response.json();
};
