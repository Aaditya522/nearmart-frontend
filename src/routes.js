import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import RetailerLogin from "./pages/RetailerLogin";
import RetailerSignup from "./pages/RetailerSignup";
import RetailerDashboard from "./pages/RetailerDashboard";
import RetailerInventory from "./pages/RetailerInventory";
import AddProduct from "./components/Admin/AddNewProduct/AddProduct";

import ProtectedRoute from "./components/common/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing -> redirect to home or login as you prefer */}
      <Route path="/" element={<Landing />} />

      {/* Customer side */}
      <Route path="/home" element={<Home />} />
      <Route path="/products" element={<ProductListing />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Retailer side */}
      <Route path="/retailer/login" element={<RetailerLogin />} />
      <Route path="/retailer/signup" element={<RetailerSignup />} />
      <Route
        path="/retailer/dashboard"
        element={
          <ProtectedRoute>
            <RetailerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retailer/inventory"
        element={
          <ProtectedRoute>
            <RetailerInventory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/retailer/add-product"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
