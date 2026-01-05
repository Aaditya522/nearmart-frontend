import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/OrderSummary.css";

const API_URL = process.env.REACT_APP_API_URL;


// const Payment = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     startPayment();
//   }, []);

//   const startPayment = async () => {
//     const res = await fetch(`${API_URL}/createPaymentOrder`, {
//       method: "POST",
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ orderId })
//     });

//     const data = await res.json();

//     const options = {
//       key: data.key,
//       amount: data.amount,
//       currency: data.currency,
//       name: "NearMART",
//       description: "Order Payment",
//       order_id: data.razorpayOrderId,
//       handler: async function (response) {
//         await fetch("http://localhost:5000/verifyPayment", {
//           method: "POST",
//           credentials: "include",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             orderId,
//             razorpay_order_id: response.razorpay_order_id,
//             razorpay_payment_id: response.razorpay_payment_id,
//             razorpay_signature: response.razorpay_signature
//           })
//         });

//         navigate("/order-success");
//       },
//       theme: { color: "#3399cc" }
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   };

//   return <p>Redirecting to payment...</p>;
// };



const Payment = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const handlePayment = async () => {
    const res = await fetch(`${API_URL}/mockPayment`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    });

    if (!res.ok) {
      alert("Payment failed");
      return;
    }

    navigate("/order-success");
  };

  return (
    <div className="order-summary-page">
      <div className="order-card">
        <h1>Payment</h1>

        <div className="order-row">
          <span>Order ID</span>
          <span>{orderId}</span>
        </div>

        <div className="order-row">
          <span>Payment Mode</span>
          <span>Demo Gateway</span>
        </div>

        <button onClick={handlePayment}>Pay Now</button>
      </div>
    </div>
  );
};

export default Payment;
