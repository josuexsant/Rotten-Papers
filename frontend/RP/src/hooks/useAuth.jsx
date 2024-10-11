import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem('isAuthenticated')) || false
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || null
  );

  const signin = async (credentials) => {
    fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.user.username);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  };

  const signout = async () => {
    fetch('http://localhost:8000/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUsername(null);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

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
