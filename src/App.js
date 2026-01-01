import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Home2 from "./pages/Home2.jsx";
import Cart from "./pages/Cart.jsx";
import Intro from "./pages/Intro.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import RetailerDashboard from "./pages/RetailerDashboard.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import OrderSummary from "./pages/OrderSummary.jsx";
import Payment from "./pages/Payment.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";


// auth
import Signup from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import AddRetailer from "./components/Admin/addRetailer/AddRetailer.js";

import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Intro />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* User Routes */}
      <Route path="/home" element={<Home />} />


      <Route
        path="/order/:orderId"
        element={
          <ProtectedRoute
            element={<OrderSummary />}
            allowedRoles={["user"]}
          />
        }
      />

      <Route
        path="/payment/:orderId"
        element={
          <ProtectedRoute
            element={<Payment />}
            allowedRoles={["user"]}
          />
        }
      />

      <Route
        path="/order-success"
        element={
          <ProtectedRoute
            element={<OrderSuccess />}
            allowedRoles={["user"]}
          />
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute
            element={<Cart />}
            allowedRoles={["user"]}
          />
        }
      />

      <Route
        path="/myOrders"
        element={
          <ProtectedRoute
            element={<OrderHistory />}
            allowedRoles={["user"]}
          />
        }
      />

      <Route
        path="/home2/:retailerId"
        element={
          <ProtectedRoute
            element={<Home2 />}
            allowedRoles={["user"]}
          />
        }
      />

      <Route path="/productDetail/:productId"
        element={
          <ProtectedRoute
            element={<ProductDetail />}
            allowedRoles={["user"]}
          />
        }
      />

      {/*  Retailer Routes */}
      <Route
        path="/retailerDashboard"
        element={
          <ProtectedRoute
            element={<RetailerDashboard />}
            allowedRoles={["retailer"]}
          />
        }
      />

      {/*Admin Routes */}
      <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute
            element={<AdminDashBoard />}
            allowedRoles={["admin"]}
          />
        }
      />

      <Route
        path="/addRetailer"
        element={
          <ProtectedRoute
            element={<AddRetailer />}
            allowedRoles={["admin"]}
          />
        }
      />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

    </Routes>
  );
}

export default App;
