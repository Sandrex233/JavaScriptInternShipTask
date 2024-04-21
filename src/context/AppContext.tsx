import React, { useState, useMemo, ReactNode } from 'react';
import { SortField, SortOrder } from '../utils/GlobalInterfaces.ts';

interface AppContextType {
  garagePages: number;
  setGaragePages: React.Dispatch<React.SetStateAction<number>>;
  winnerPages: number;
  setwinnerPages: React.Dispatch<React.SetStateAction<number>>;
  createCarName: string;
  setCreateCarName: React.Dispatch<React.SetStateAction<string>>;
  createCarColor: string;
  setCreateCarColor: React.Dispatch<React.SetStateAction<string>>;
  updateCarName: string;
  setUpdateCarName: React.Dispatch<React.SetStateAction<string>>;
  updateCarColor: string;
  setUpdateCarColor: React.Dispatch<React.SetStateAction<string>>;
  sortBy: SortField,
  setSortBy: React.Dispatch<React.SetStateAction<SortField>>,
  sortOrder: SortOrder,
  setSortOrder: React.Dispatch<React.SetStateAction<SortOrder>>,
}

export const AppContext = React.createContext<AppContextType | undefined>(
  undefined,
);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [garagePages, setGaragePages] = useState<number>(1);
  const [winnerPages, setwinnerPages] = useState<number>(1);
  const [createCarName, setCreateCarName] = useState<string>('');
  const [createCarColor, setCreateCarColor] = useState<string>('#000000');
  const [updateCarName, setUpdateCarName] = useState<string>('');
  const [updateCarColor, setUpdateCarColor] = useState<string>('#000000');
  const [sortBy, setSortBy] = useState<SortField>(SortField.WINS);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);

  const contextValue = useMemo(
    () => ({
      garagePages,
      setGaragePages,
      winnerPages,
      setwinnerPages,
      createCarName,
      setCreateCarName,
      createCarColor,
      setCreateCarColor,
      updateCarName,
      setUpdateCarName,
      updateCarColor,
      setUpdateCarColor,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
    }),
    [
      garagePages,
      setGaragePages,
      winnerPages,
      setwinnerPages,
      createCarName,
      setCreateCarName,
      createCarColor,
      setCreateCarColor,
      updateCarName,
      setUpdateCarName,
      updateCarColor,
      setUpdateCarColor,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
