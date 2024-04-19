import generateRandomCar from '../utils/GenerateRandomCars.ts';
import {
  Car,
  EngineResponseDTO,
  Winner,
  WinnerDTO,
  WinnerWithCar,
} from '../utils/GlobalInterfaces.ts';

const BASE_URL = 'http://localhost:3000';

export const getCar = async (id: number): Promise<Car> => {
  const response = await fetch(`${BASE_URL}/garage/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch car with ID ${id}`);
  }

  const car = await response.json();
  return car;
};

export default async function fetchWinners(
  page: number,
  limit: number,
  sort: string,
  order: string,
): Promise<{ winners: WinnerWithCar[]; totalCount: number }> {
  const response = await fetch(`${BASE_URL}/winners?_page=${page}&_limit=${limit}&_sort=${sort}&_order=${order}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch winners');
  }

  const totalCountHeader = response.headers.get('X-Total-Count');
  const totalCount = totalCountHeader ? parseInt(totalCountHeader, 10) : 0;

  const winnersWithoutCars: Winner[] = await response.json();
  const winnersWithCars = await Promise.all(
    winnersWithoutCars.map(async (winnerWithoutCar) => {
      const car = await getCar(winnerWithoutCar.id);
      return { ...winnerWithoutCar, car };
    }),
  );

  return { winners: winnersWithCars, totalCount };
}

export const getWinner = async (winnerId: number): Promise<WinnerDTO> => {
  const response = await fetch(`${BASE_URL}/winners/${winnerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Winner not found');
    } else {
      throw new Error('Failed to get winner');
    }
  }

  return response.json();
};

export const updateWinner = async (dataParams: WinnerDTO): Promise<WinnerDTO> => {
  const winnerData: WinnerDTO = await getWinner(dataParams.id);
  let dataDTO: {wins: number, time: number } = { wins: winnerData.wins + 1, time: winnerData.time };
  if (winnerData.time > dataParams.time) {
    dataDTO = { wins: winnerData.wins + 1, time: dataParams.time };
  }

  const response = await fetch(`${BASE_URL}/winners/${dataParams.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataDTO),
  });

  if (!response.ok) {
    throw new Error('Failed to update winner');
  }

  const data = await response.json();
  return data;
};

export const createWinner = async (dataParams: WinnerDTO): Promise<WinnerDTO> => {
  const data: WinnerDTO = { ...dataParams };
  const response = await fetch(`${BASE_URL}/winners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 500) {
    await updateWinner(data);
  } else if (!response.ok) {
    throw new Error('Failed to create winner');
  }

  return response.json();
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

export const switchToDriveMode = async (
  id: number,
): Promise<{ success: boolean }> => {
  const response = await fetch(`${BASE_URL}/engine?id=${id}&status=drive`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to switch to drive mode');
  }

  return response.json();
};
