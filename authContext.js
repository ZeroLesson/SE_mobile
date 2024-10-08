import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  const login = (userData) => {
    const { username, firstname, lastname, positionName, nurseID,salary} = userData;
    setUser({ username, firstname, lastname, positionName, nurseID,salary}); 
    setIsLogin(true);
  };

  const logout = () => {
    setUser(null);
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLogin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
