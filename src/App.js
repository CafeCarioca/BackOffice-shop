import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import UserList from './pages/UserList';
import User from './pages/User';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Login from './pages/Login';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

function App() {
  const token = "123456abcdef" // Token de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("isAuthenticated") !== null; // Recupera autenticación
  });
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem("token", token); // Guarda autenticación
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("token"); // Elimina el token al cerrar sesión
  };

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("isAuthenticated", "false"); // Limpia autenticación al cerrar sesión
    }
  }, [isAuthenticated]);

  return (
    <Router>
        <>
          <NavBar onLogout={handleLogout}/>
          <div className="container">
            <SideBar />
            <Switch>
              <Route path="/" exact>
                <Home />
              </Route>
              <Route path="/users" exact>
                <UserList />
              </Route>
              <Route path="/user/:userId">
                <User />
              </Route>
              <Route path="/products" exact>
                <h1>Products</h1>
              </Route>
              <Route path="/orders" exact>
                <Orders />
              </Route>
              <Route path="/order/:orderId" exact>
                <OrderDetails />
              </Route>
            </Switch>
          </div>
        </>
    </Router>
  );
}

export default App;
