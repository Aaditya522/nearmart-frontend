import React, { useState, useEffect } from "react";
import "./NavBar.css";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;




const NavBar = () => {

  const [authStatus, setAuthStatus] = useState("login");

  function checkLogInOut() {
    fetch(`${API_URL}/me`, {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Not logged in") {
          setAuthStatus("login");
          navigate("/login")
        }
        else if (data.message === "User authenticated successfully") {
          setAuthStatus("logout");
        }
      })
      .catch(err => console.log(err));
  };

  function checkRole(){
    const res = fetch("http://localhost:5000/me", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Not logged in") {
          navigate("/")
        }
        else if (data.message === "User authenticated successfully") {
          if(data.role === "retailer"){
            navigate("/retailerDashboard");
          }
          if(data.role === "admin"){
            navigate("/adminDashboard");
          }
          if(data.role === "user"){
            navigate("/home");
          }
        }
      })
      .catch(err => console.log(err));
  };


useEffect(() => {
  checkLogInOut();
}, [authStatus]);


const navigate = useNavigate();

return (
  <div className="promo-banner">
    <div>
      <img src="/nearmart_logo.png" className="logo" alt="NearMART" />
    </div>

    <div className="buttons">

      <button onClick={checkRole}>Home</button>

      <button //login-logout button
        onClick={async () => {

          if (authStatus === "login") {
            navigate("/login");
          }
          else {
            try {
              const res = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include"
              });

              alert("logged out Succesful.");
              setAuthStatus("login");

            } catch (err) {
              console.error("Logout failed", err);
            }
          }

        }}
      >{authStatus}</button>

    </div>
  </div>
);
};

export default NavBar;
