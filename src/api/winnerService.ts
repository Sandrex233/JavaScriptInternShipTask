import { Winner, WinnerWithCar } from '../utils/GlobalInterfaces.ts';
import BASE_URL from './apiBaseUrl.ts';
import { getCar } from './carService.ts';

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

export const getWinner = async (winnerId: number): Promise<Winner> => {
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

export const updateWinner = async (dataParams: Winner): Promise<Winner> => {
  const winnerData: Winner = await getWinner(dataParams.id);
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

export const createWinner = async (dataParams: Winner): Promise<Winner> => {
  const data: Winner = { ...dataParams };
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
