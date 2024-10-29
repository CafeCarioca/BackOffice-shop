import './App.css';
import NavBar from './components/NavBar';
import SideBar from './components/SideBar';
import Home from './pages/Home';
import UserList from './pages/UserList';
import User from './pages/User';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <NavBar />
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
            <User/>
          </Route>
          <Route path="/products" exact>
            <h1>Products</h1>
          </Route>
          <Route path="/orders" exact>
            <Orders/>
          </Route>
          <Route path="/order/:orderId" exact>
            <OrderDetails />
          </Route>
          </Switch>
      </div>
    </Router>
  );
}

export default App;