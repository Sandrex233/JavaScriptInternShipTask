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

export interface WinnerDTO {
  id: number;
  wins: number;
  time: number;
}

export enum CarStatus {
  Stopped,
  Started,
  Drive,
}
