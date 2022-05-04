import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./pages/Login"
import PaidOrder from "./pages/PaidOrder";
import Home from "./pages/Home";
import Orders from "./pages/orders/Orders";
import OrderHistory from "./pages/orderHistory/OrderHistory";
import ProcessingOrders from "./pages/processingOrders/ProccessingOrders";
import BeforeAcceptOrders from "./pages/beforeAcceptOrders/BeforeAcceptOrders";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Orders />}></Route>
        </Routes>
        <Routes>
          <Route path="/orderHistory" element={<OrderHistory />}></Route>
        </Routes>
        <Routes>
          <Route path="/processingOrders" element={<ProcessingOrders />}></Route>
        </Routes>
        <Routes>
          <Route path="/orders" element={<Orders />}></Route>
        </Routes>
        <Routes>
          <Route path="/beforeAcceptOrders" element={<BeforeAcceptOrders />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
