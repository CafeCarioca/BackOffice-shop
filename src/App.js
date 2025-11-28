import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import UserList from './pages/UserList';
import User from './pages/User';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Products from './pages/Products';
import Discounts from './pages/Discounts';
import Coupons from './pages/Coupons';

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
                <Products />
              </Route>
              <Route path="/discounts" exact>
                <Discounts />
              </Route>
              <Route path="/coupons" exact>
                <Coupons />
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
