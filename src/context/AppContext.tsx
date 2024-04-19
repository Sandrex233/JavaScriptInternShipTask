import React, {
  useState, useMemo, ReactNode,
} from 'react';

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
}

export const AppContext = React.createContext<AppContextType | undefined>(undefined);

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
    ],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
