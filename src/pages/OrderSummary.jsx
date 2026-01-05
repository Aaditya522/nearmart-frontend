import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/OrderSummary.css";
const API_URL = process.env.REACT_APP_API_URL;


const OrderSummary = () => {
    
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(`${API_URL}/order/${orderId}`, {
    credentials: "include",
  })
    .then(async (res) => {
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load order");
      }

      setOrder(data);
      setLoading(false);
    })
    .catch((err) => {
      alert(err.message);
      navigate("/cart");
    });
}, [orderId, navigate]);

  if (loading) return <p>Loading order...</p>;

  return (
<div className="order-summary-page">
  <div className="order-card">
    <h1>Order Summary</h1>

    <div className="order-row">
      <span>Order ID</span>
      <span>{order._id}</span>
    </div>

    <div className="order-row">
      <span>Total Amount</span>
      <span className="amount">₹{order.totalAmount}</span>
    </div>

    <button onClick={() => navigate(`/payment/${order._id}`)}>
      Proceed to Payment
    </button>
  </div>
</div>
  );
};

export default OrderSummary;
