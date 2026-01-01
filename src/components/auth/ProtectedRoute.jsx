import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;


function ProtectedRoute({ element, allowedRoles }) {
  const [auth, setAuth] = useState({
    loading: true,
    isAuthenticated: false,
    role: null,
  });

  useEffect(() => {
    fetch(`${API_URL}/me`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();

        setAuth({
          loading: false,
          isAuthenticated: true,
          role: data.role,
        });
      })
      .catch(() => {
        setAuth({
          loading: false,
          isAuthenticated: false,
          role: null,
        });
      });
  }, []);

  if (auth.loading) return <p>Loading...</p>;


  if (!auth.isAuthenticated) {
    alert("You need to Login to perform any activity.");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(auth.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
}

export default ProtectedRoute;
