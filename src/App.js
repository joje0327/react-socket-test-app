import logo from './logo.svg';
import styles from './App.module.css';
import {BrowserRouter,Routes,Route} from "react-router-dom";
import Login from "./pages/login/Login"
import PaidOrder from "./pages/PaidOrder";
import Home from "./pages/Home";
import Orders from "./pages/orders/Orders";
import OrderHistory from "./pages/orderHistory/OrderHistory";
import ProcessingOrders from "./pages/processingOrders/ProccessingOrders";
import BeforeAcceptOrders from "./pages/beforeAcceptOrders/BeforeAcceptOrders";
import StockManage from "./pages/stockManage/StockManage";
import Setting from "./pages/setting/Setting";
import {useState} from "react";

function App() {




  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Orders />}></Route>
          <Route path="/orderHistory" element={<OrderHistory />}></Route>
          <Route path="/processingOrders" element={<ProcessingOrders />}></Route>
          <Route path="/orders" element={<Orders />}></Route>
          <Route path="/beforeAcceptOrders" element={<BeforeAcceptOrders />}></Route>
          <Route path="/stockManage" element={<StockManage />}></Route>
          <Route path="/settings" element={<Setting />}></Route>
        </Routes>
        {/*<Routes>*/}
        {/*  <Route path="/" element={<Orders storeName={storeName} />}></Route>*/}
        {/*</Routes>*/}
        {/*<Routes>*/}
        {/*  <Route path="/orderHistory" element={<OrderHistory storeName={storeName} />}></Route>*/}
        {/*</Routes>*/}
        {/*<Routes>*/}
        {/*  <Route path="/processingOrders" element={<ProcessingOrders storeName={storeName} />}></Route>*/}
        {/*</Routes>*/}
        {/*<Routes>*/}
        {/*  <Route path="/orders" element={<Orders storeName={storeName} />}></Route>*/}
        {/*</Routes>*/}
        {/*<Routes>*/}
        {/*  <Route path="/beforeAcceptOrders" element={<BeforeAcceptOrders storeName={storeName} />}></Route>*/}
        {/*</Routes>*/}
        {/*<Routes>*/}
        {/*  <Route path="/stockManage" element={<StockManage storeName={storeName} />}></Route>*/}
        {/*</Routes>*/}
        {/*<Routes>*/}
        {/*  <Route path="/settings" element={<Setting storeName={storeName} />}></Route>*/}
        {/*</Routes>*/}
      </BrowserRouter>



    </div>
  );
}

export default App;
