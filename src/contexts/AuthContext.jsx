import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleLogin = (value) => {
    setIsLoginOpen(value !== undefined ? value : !isLoginOpen);
  };

  return (
    <AuthContext.Provider value={{ isLoginOpen, toggleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
