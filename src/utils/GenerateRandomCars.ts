import { Car } from './GlobalInterfaces.ts';

const generateRandomCars = (): Car => {
  const carParts1 = [
    'Tesla',
    'Ford',
    'Chevrolet',
    'Toyota',
    'Honda',
    'Volkswagen',
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Subaru',
    'Jeep',
  ];
  const carParts2 = [
    'Model S',
    'Camaro',
    'Corolla',
    'Accord',
    'Golf',
    '3 Series',
    'C-Class',
    'A4',
    'Outback',
    'Wrangler',
    'F-150',
  ];
  const colors = [
    '#ff0000',
    '#0000ff',
    '#ffffff',
    '#000000',
    '#c0c0c0',
    '#808080',
    '#008000',
  ];

  const generateRandomName = (): string => {
    const part1 = carParts1[Math.floor(Math.random() * carParts1.length)];
    const part2 = carParts2[Math.floor(Math.random() * carParts2.length)];
    return `${part1} ${part2}`;
  };

  const generateRandomColor = (): string => colors[Math.floor(Math.random() * colors.length)];

  const newCar: Car = {
    name: generateRandomName(),
    color: generateRandomColor(),
  };

  return newCar;
};

export default generateRandomCars;
