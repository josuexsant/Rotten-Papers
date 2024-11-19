import { createContext, useContext, useState, useEffect } from "react";
import { host } from "../api/api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem("username") || null
  );

  const [error, setError] = useState("");

  const signin = async (credentials) => {
    fetch(`${host}/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("Success:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        //console.error("Error:", error);
        setError("Usuario o contraseña incorrectos");
      });
  };

  const signout = async () => {
    fetch(`${host}/logout/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to sign out");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUsername(null);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("username", username);
  }, [username]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, username, signin, signout, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
