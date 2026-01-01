import React, { useEffect, useState } from "react";
import "./RetailerOrders.css";
const API_URL = process.env.REACT_APP_API_URL;


const RetailerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("COMPLETED");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/retailerOrders`, {
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
            setOrders(data); //All Orders
            setLoading(false);
        } catch (err) {
            setError("Server error");
            setLoading(false);
        }
    };

    const pendingOrders = orders.filter((order) => order.orderStatus === "PLACED");

    const completedOrders = orders.filter((order) => order.orderStatus === "CONFIRMED" && order.payment?.status === "PAID");

    const failedOrders = orders.filter((order) => order.orderStatus === "CANCELLED" || order.payment?.status === "FAILED");

    const getVisibleOrders = () => {
        if (activeTab === "PENDING") return pendingOrders;
        if (activeTab === "COMPLETED") return completedOrders;
        if (activeTab === "FAILED") return failedOrders;
        return [];
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <>
        <h1>Your Orders</h1>
        <div className="Orders-details">
            <div className="left-details">
                <div className="order-btns">
                    <button onClick={() => setActiveTab("COMPLETED")}>Confirmed</button>
                    <button onClick={() => setActiveTab("FAILED")}>Failed</button>
                    <button onClick={() => setActiveTab("PENDING")}>Pending</button>
                </div>
                <div className="orderCount">
                    <div>
                        <h3>Confirmed Orders:</h3>
                        <p>{completedOrders.length}</p>
                    </div>
                    <div>
                        <h3>Failed Orders:</h3>
                        <p>{failedOrders.length}</p>
                    </div>
                    <div>
                        <h3>Pending Orders:</h3>
                        <p>{pendingOrders.length}</p>
                    </div>
                </div>
            </div>

            <div className="right-details">
                {getVisibleOrders().length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Address</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {getVisibleOrders().map((order) => (
                                <React.Fragment key={order._id}>
                                    {/* ORDER ROW */}
                                    <tr className="order-row">
                                        <td>{order._id}</td>
                                        <td>
                                            {order.userId?.name}
                                            <br />
                                            <small>{order.userId?.email}</small>
                                        </td>
                                        <td>
                                            {order.userId?.address?.at},{" "}
                                            {order.userId?.address?.city} -{" "}
                                            {order.userId?.address?.pincode}
                                        </td>
                                        <td>₹{order.totalAmount}</td>
                                        <td>
                                            <span className={`status ${order.orderStatus.toLowerCase()}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                    </tr>

                                    {/* PRODUCT LIST ROW */}
                                    <tr className="items-row">
                                        <td colSpan="5">
                                            <div className="items-box">
                                                <strong>Products:</strong>
                                                <ul>
                                                    {order.items.map((item, index) => (
                                                        <li key={index}>
                                                            <span><u>Product</u>: {item.productName}, </span> 
                                                            <span><u>Quantity</u>: {item.quantity}, </span> 
                                                            <span><u>Price</u>: ₹{item.price}/- </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </>
    );
};

export default RetailerOrders;
