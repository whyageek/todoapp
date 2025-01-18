import React, { createContext, useState } from 'react';

export const ProContext = createContext();

export const ProProvider = ({ children }) => {
  const [isPro, setIsPro] = useState(false);

  const upgradeToPro = () => {
    setIsPro(true);
  };

  return (
    <ProContext.Provider value={{ isPro, upgradeToPro }}>
      {children}
    </ProContext.Provider>
  );
};
