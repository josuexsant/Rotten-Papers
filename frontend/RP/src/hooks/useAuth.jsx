import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || null
  );

  const signin = async (newUsername = 'user') => {
    console.log('signin');
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula un retraso
    setIsAuthenticated(true);
    setUsername(newUsername);
    localStorage.setItem('isAuthenticated', JSON.stringify(true));
    localStorage.setItem('username', newUsername);
  };


  const signout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simula un retraso
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  };

  useEffect(() => {
    localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('username', username);
  }, [username]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
