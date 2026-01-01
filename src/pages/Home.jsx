import React, { useEffect, useRef } from "react";
import "../styles/Home.css";

import NavBar from "../components/common/NavBar/NavBar.jsx";
import Footer from "../components/common/Footer/Footer.jsx";

import Products from "../components/Customer/Products.jsx";
import NearbyRetailers from "../components/Customer/NearbyRetailers.jsx";
const API_URL = process.env.REACT_APP_API_URL;



const Home = () => {
  const alerted = useRef(false);

  useEffect(() => {
    fetch(`${API_URL}/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
      })
      .catch(() => {
        if (!alerted.current) {
          alert(
            "Need to Login with proper credentials for seamless experience"
          );
          alerted.current = true;
        }
      });
  }, []);

  return (
    <div className="main">
      <NavBar />

      <div className="container1">
        <h1>Smart Shopping from Local Retailers</h1>

        <NearbyRetailers />

        <h2>Recommended Products:</h2>
        <Products />
      </div>

      <Footer />
    </div>
  );
};

export default Home;