import React from 'react';
import { useContext, useState, createContext } from 'react';

interface Props {
    children?: React.ReactNode | JSX.Element;
}
export interface MonitorContextType {
    optionsOpen: boolean;
    setOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const MonitorContext = createContext<MonitorContextType | undefined>(
  undefined
);

export function MonitorProvider({ children }: Props) {
  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  return (
    <MonitorContext.Provider value={{ optionsOpen, setOptionsOpen }}>
      {children}
    </MonitorContext.Provider>
  );
}

export const useMonitor = () => {
  const context = useContext(MonitorContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a MyUserContextProvider.`);
  }
  return context;
};