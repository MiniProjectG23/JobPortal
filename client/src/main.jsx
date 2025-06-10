import React, { createContext, useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Cookies from "js-cookie"


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

useEffect(() => {
  const storedUser = Cookies.get("user");
  const storedAuthStatus = Cookies.get("isAuthorized");

  if (storedUser && storedAuthStatus === "true") {
    setUser(JSON.parse(storedUser));
    setIsAuthorized(true);
  }
}, []);

useEffect(() => {
  if (isAuthorized && user) {
    Cookies.set("user", JSON.stringify(user), { expires: 1 }); // 1 day expiry
    Cookies.set("isAuthorized", "true", { expires: 1 });
  } else {
    Cookies.remove("user");
    Cookies.remove("isAuthorized");
  }
}, [isAuthorized, user]);


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
