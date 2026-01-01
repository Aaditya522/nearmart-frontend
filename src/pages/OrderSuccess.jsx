import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={{  minHeight: "100vh",display: "flex",alignItems: "center",justifyContent: "center",background: "#f5f7fa",}} >
      <div style={{background: "#fff",padding: "40px",borderRadius: "10px",boxShadow: "0 4px 12px rgba(0,0,0,0.1)",textAlign: "center",maxWidth: "420px",width: "100%",}}>
        <h1 style={{ color: "#2ecc71", marginBottom: "10px" }}>✅ Order Successful</h1>

        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          Thank you for your purchase!  
          Your order has been placed successfully.
        </p>

        <div style={{ marginBottom: "20px", color: "#555" }}>
          <p>You will receive updates about your order status.</p>
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button onClick={() => navigate("/")}
            style={{
              padding: "10px 18px",
              border: "none",
              borderRadius: "6px",
              background: "#3498db",
              color: "#fff",
              cursor: "pointer",
            }}> Continue Shopping </button>

          <button onClick={() => navigate("/cart")}
            style={{
              padding: "10px 18px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#191616ff",
              cursor: "pointer",
            }}> View Cart </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
