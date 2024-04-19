export interface Car {
  id?: number;
  name: string;
  color: string;
  engineStatus?: 'stopped' | 'started';
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerWithCar extends Winner {
  car: Car;
}

export interface EngineResponseDTO {
  velocity: number;
  distance: number;
}

// eslint-disable-next-line no-shadow
export enum CarStatus {
  // eslint-disable-next-line no-unused-vars
  Stopped,
  // eslint-disable-next-line no-unused-vars
  Started,
  // eslint-disable-next-line no-unused-vars
  Drive,
}
