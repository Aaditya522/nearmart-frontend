import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/OrderHistory.css";
import NavBar from "../components/common/NavBar/NavBar";
import Footer from "../components/common/Footer/Footer";
const API_URL = process.env.REACT_APP_API_URL;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/myOrders`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to fetch orders");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError("Server error");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading your orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
    <NavBar/>
    <div className="order-history">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <table className="order-history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Order Status</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>

                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td>₹{order.totalAmount}</td>

                <td>
                  <span
                    className={`status ${order.orderStatus.toLowerCase()}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td>
                  <span
                    className={`payment ${
                      order.payment?.status?.toLowerCase()
                    }`}
                  >
                    {order.payment?.status || "PENDING"}
                  </span>
                </td>

                <td>
                  <button
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default OrderHistory;
