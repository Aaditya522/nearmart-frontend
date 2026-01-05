import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    <div>
      <h1>Order Summary</h1>

      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Total:</strong> ₹{order.totalAmount}</p>

      <button onClick={() => navigate(`/payment/${order._id}`)}>
        Proceed to Payment
      </button>
    </div>
  );
};

export default OrderSummary;
