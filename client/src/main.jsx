import React, { createContext, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Define default values
const defaultContext = {
  isAuthorized: false,
  setIsAuthorized: () => {},
  user: {},
  setUser: () => {},
};

export const Context = createContext(defaultContext);

const AppWrapper = () => {
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [user, setUser] = useState({});

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
