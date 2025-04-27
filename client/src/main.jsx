import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Define the context with default values
const defaultContext = {
  isAuthorized: false,
  setIsAuthorized: () => {},
  user: null,
  setUser: () => {},
};

export const Context = createContext(defaultContext);

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuthStatus = localStorage.getItem("isAuthorized");

    if (storedUser && storedAuthStatus) {
      setUser(JSON.parse(storedUser)); // Parse the stored user data
      setIsAuthorized(true); // Set the authorization status to true
    }
  }, []);

  // Save the user and authorization status to localStorage whenever they change
  useEffect(() => {
    if (isAuthorized && user) {
      localStorage.setItem("user", JSON.stringify(user)); // Save user data
      localStorage.setItem("isAuthorized", "true"); // Mark as authorized
    } else {
      localStorage.removeItem("user"); // Remove user data if logged out
      localStorage.removeItem("isAuthorized"); // Remove authorization status
    }
  }, [isAuthorized, user]); // Run this effect when either isAuthorized or user changes

  return (
    <Context.Provider value={{ isAuthorized, setIsAuthorized, user, setUser }}>
      <App />
    </Context.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
