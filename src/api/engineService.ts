import { EngineResponseDTO } from '../utils/GlobalInterfaces.ts';
import BASE_URL from './apiBaseUrl.ts';

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
