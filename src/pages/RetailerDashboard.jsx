import React, { useState, useEffect } from "react";
import "../styles/RetailerDashboard.css";
import "../styles/Sidebar.css";
import AddNewProduct from "../components/Retailer/AddNewProduct/AddNewProduct.jsx";
import RetailerProducts from "../components/Retailer/RetailerProducts/RetailerProducts.jsx";
import RetailerOrders from "../components/Retailer/RetailerOrders/RetailerOrders.jsx";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;



const RetailerDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");

  const [showProfile, setShowProfile] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showOrders, setShowOrders] = useState(true);

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
        } else if (data.message === "User authenticated successfully") {
          setAuthStatus("logout");
        }
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    checkLogInOut();
  }, []);




  useEffect(() => {
    if (!showProfile) return;

    setLoading(true);

    fetch(`${API_URL}/userDetails`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Not logged in");
          setUserData(null);
        }
        else {
          setUserData(data);
          setMessage("");
        }
      })
      .catch(() => {
        setMessage("Unable to fetch user details");
        setUserData(null);
      })
      .finally(() => setLoading(false));
  }, [showProfile]);


  const manageStates = () => {
    setShowProfile(true);
    setShowAddProduct(false);
    setShowProducts(false);
    setShowOrders(false);
  }

  const manageStates2 = () => {
    setShowProfile(false);
    setShowAddProduct(true);
    setShowProducts(false);
    setShowOrders(false);
  }

  const manageStates3 = () => {
    setShowProfile(false);
    setShowAddProduct(false);
    setShowProducts(true);
    setShowOrders(false);
  }

  const manageStates4 = () => {
    setShowProfile(false);
    setShowAddProduct(false);
    setShowProducts(false);
    setShowOrders(true);
  }

  return (
    <div>
      <div className="container">
        <div className="left_container">

          {/* SIDEBAR */}
          <div className="retailer-sidebar">
            <div className="retailer-sidebar-logo">
              <img src="/nearmart_logo.png" className="retailer-logo-icon" />
            </div>

            <nav className="retailer-menu">


              <div className="retailer-menu-item" onClick={manageStates4}>
                <span className="retailer-menu-icon">🧩</span>
                <span>Orders</span>
              </div>

              <div className="retailer-menu-item" onClick={manageStates3}>
                <span className="retailer-menu-icon">🏠</span>
                <span>Products</span>
              </div>

              <div className="retailer-menu-item" onClick={manageStates2}>
                <span className="retailer-menu-icon">+</span>
                <span>Add New Product</span>
              </div>

              <div className="retailer-menu-item" onClick={manageStates}>
                <span className="retailer-menu-icon">👤</span>
                <span> Profile</span>
              </div>
            </nav>

            <div className="retailer-sidebar-footer">

              <div
                className="retailer-logout"
                onClick={async () => {
                  if (authStatus === "login") {
                    navigate("/login");
                  } else {
                    try {
                      await fetch(`${API_URL}/logout`, {
                        method: "POST",
                        credentials: "include",
                      });

                      alert("Logged out successfully.");
                      setAuthStatus("login");
                    } catch (err) {
                      console.error("Logout failed", err);
                    }
                  }
                }}
              >
                <span>{authStatus}</span>
              </div>
            </div>
          </div>
          {/* SIDEBAR END */}

        </div>

        <div className="right_container">
          {/* Dashbaord */}
          {showProducts && <RetailerProducts />}

          {/* Add-Product Form */}
          {showAddProduct && <AddNewProduct />}

          {showOrders && < RetailerOrders/>}

          {/* Profile */}
          {showProfile && (  
            <div className="">
              {loading && <p>Loading profile...</p>}

              {!loading && message && (
                <p className="profile-message">{message}</p>
              )}

              {!loading && userData && (
                <div className="profile-content">
                  <img src = {`${API_URL}/uploads/${userData.shopImage}`} />
                  <h3>{userData.name}</h3>
                  <p><strong>Email:</strong> {userData.email}</p>

                  <p><strong>Address:</strong></p>

                  <p>
                    {userData.address?.at}, {userData.address?.city} –{" "}
                    {userData.address?.pincode}
                  </p>

                  {userData.role === "retailer" && (
                    <>
                      <p><strong>Shop:</strong> {userData.shopName}</p>
                      <p><strong>Category:</strong> {userData.productType}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default RetailerDashboard;
