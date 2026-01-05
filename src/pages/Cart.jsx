import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/common/NavBar/NavBar";
import Footer from "../components/common/Footer/Footer";
import "../styles/Cart.css";
const API_URL = process.env.REACT_APP_API_URL;


const Cart = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [productDetail, setProductDetail] = useState(null);
    const [retailerName, setRetailerName] = useState(null);

    const navigate = useNavigate();

    /* =======================
       Calculate total
    ======================= */
    useEffect(() => {
        let total = 0;
        products.forEach((item) => { total += item.productPrice * item.quantity; });
        setTotalPrice(total);
    }, [products]);

    /* =======================
       Fetch Cart
    ======================= */
    useEffect(() => {
        fetch(`${API_URL}/cart`, {
            method: "GET",
            credentials: "include",
        })
            .then(async (res) => {
                const data = await res.json();

                if (data.message) {

                    if (data.message === "Not logged in") {
                        navigate("/login");
                        return;
                    }

                    if (data.message === "Not authorized, Only Customers Have Cart!") {
                        if (data.role === "admin") navigate("/adminDashboard");
                        if (data.role === "retailer") navigate("/retailerDashboard");
                        return;
                    }
                }

                if (!data.products || data.products.length === 0) {
                    setProducts([]);
                    setLoading(false);
                    return;
                }

                setRetailerName(data.retailerName);
                setProducts(data.products);
                setProductDetail(data.products[0]);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Cart fetch error:", err);
                alert("Failed to load cart");
                setLoading(false);
            });
    }, [navigate]);

    /* =======================
       Update Quantity
    ======================= */
    const updateQuantity = async (cartId, newQty) => {
        if (newQty < 1) return;

        try {
            const res = await fetch(`${API_URL}/update-quantity`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ cartId, quantity: newQty }),
            });

            const data = await res.json();

            setProducts((prev) =>
                prev.map((item) =>
                    item._id === cartId
                        ? { ...item, quantity: data.quantity }
                        : item
                )
            );

            if (newQty > data.quantity) {
                alert(`Only ${data.quantity} items available in stock`);
            }
        } catch (err) {
            console.error("Quantity update failed", err);
        }
    };

    /* =======================
       REMOVE Products
    ======================= */
    const removeFromCart = async (cartItemId) => {
        try {
            const res = await fetch(`${API_URL}/removeProduct`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ cartItemId }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to remove item");
                return;
            }
            setProducts((prev) => {
                const updated = prev.filter(
                    (item) => item._id !== cartItemId
                );

                if (updated.length === 0) {
                    setRetailerName("");
                }

                return updated;
            });

            if (productDetail?._id === cartItemId) {
                setProductDetail(null);
            }

        } catch (error) {
            console.error("Remove cart item error:", error);
        }
    };


    useEffect(() => {
        if (products.length > 0 && !productDetail) {
            setProductDetail(products[0]);
        }
    }, [retailerName, products, productDetail]);


    const openProduct = (productId) => {
        navigate(`/productDetail/${productId}`);
    };



    const orderNow = async () => {
        try {
            const res = await fetch(`${API_URL}/createOrder`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to create order");
                return;
            }

            alert("Order created successfully!");

            navigate(`/order/${data.orderId}`); //Navigting user to OrderSummary Page;

            console.log("Order ID:", data.orderId);
            console.log("Total Amount:", data.totalAmount);

        } catch (error) {
            console.error("Order creation error:", error);
            alert("Something went wrong while placing order");
        }
    };




    if (loading) {
        return <p className="cart-loading">Loading your cart...</p>;
    }

    return (
        <div className="cart-page">
            <NavBar />

            <h1>Your Cart</h1>

            {retailerName ? (<h2 style={{ marginLeft: "20px" }}>Shop: {retailerName}</h2>) : <h2></h2>}

            <div className="cart-container">
                {/* ================= Cart List ================= */}
                {products.length === 0 ? (
                      <div className="empty-cart-container">
    <p>Your cart is empty</p>
    <button onClick={() => navigate("/home")}>
      Continue Shopping
    </button>
  </div>
                ) : (
                    <div className="cart-list">
                        {products.map((item) => (
                            <div className="cart-card" key={item._id} onClick={() => setProductDetail(item)}>
                                <div className="image">
                                    <img src={item.imageUrl} alt={item.productName} />
                                </div>

                                <div className="detail">

                                    <h4>{item.productName}</h4>

                                    <p>Price: ₹{item.productPrice}</p>

                                    <div className="quantity-control">
                                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, item.quantity - 1); }} disabled={item.quantity <= 1}>−</button>

                                        <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item._id, Number(e.target.value))} />

                                        <button onClick={(e) => { e.stopPropagation(); updateQuantity(item._id, item.quantity + 1); }}>+</button>
                                    </div>

                                    <p className="total">
                                        Total: ₹{item.productPrice * item.quantity}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ================= Product Preview ================= */}
                {productDetail && (
                    <div className="product_preview">
                        <h3>Details</h3>

                        <div className="product" onClick={() => { openProduct(productDetail.productId) }}>
                            <div className="product_image">
                                <img src={productDetail.imageUrl} alt={productDetail.productName} />
                            </div>

                            <div className="detail" >
                                <h2>{productDetail.productName}</h2>
                                <p className="price">Price: ₹{productDetail.productPrice}/-</p>
                                <div>Quantity: {productDetail.quantity}</div>
                                <p className="total">Total: ₹ {productDetail.productPrice * productDetail.quantity} </p>

                                <button className="remove_btn" onClick={(e) => { e.stopPropagation(); removeFromCart(productDetail._id) }}> Remove Product</button>
                            </div>
                        </div>

                        <footer>
                            <h3>Total: ₹{totalPrice}</h3>
                            <button onClick={orderNow}>Order Now</button>
                        </footer>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Cart;
