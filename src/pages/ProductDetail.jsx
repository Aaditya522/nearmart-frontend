import { useParams,useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "../styles/ProductDetail.css";

import Navbar from "../components/common/NavBar/NavBar.jsx";
import Footer from "../components/common/Footer/Footer.jsx";
const API_URL = process.env.REACT_APP_API_URL;



export default function ProductDetail() {

    const navigate = useNavigate();
    const { productId } = useParams(); //  FIXED 

    const [product, setProduct] = useState(null);
    const [retailer, setRetailer] = useState(null);
    const [size, setSize] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch( `${API_URL}/productDetail/${productId}`,
                    { credentials: "include" }
                );

                const data = await res.json();

                setProduct(data.product);
                setRetailer(data.retailer);
                setSize(data.product?.sizeOptions?.[0] || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);


    const addCart = async (id) => {
        try {
            const res = await fetch("http://localhost:5000/addCart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: id }),
            });

            const result = await res.json();
            alert(result.message);
        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };


    const retailerProducts = async (retailerId) => {
        console.log("Retailer ID:", retailerId);
        navigate(`/home2/${retailerId}`);
    };

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
    if (!product) return <h2 style={{ textAlign: "center" }}>Product Not Found</h2>;


    return (
        <>
            <Navbar />
            <div className="product-page">

                <div className="image-section">
                    <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className="main-image"
                    />
                </div>

                <div className="details-section">
                    <div>
                        <p className="about-text">About Product</p>
                        <p className="category">{product.category}</p>
                        <br />
                        <h1 className="title">{product.productName}</h1>
                        <br />
                        <div className="price">₹{product.price} /-</div>
                        <br />
                        
                        <p className="description"><b>Description: </b>{product.description}</p>

                        {/* SIZE (only if exists) */}
                        {product.size && (
                            <div className="option-group">
                                <p className="option-label">SIZE:</p>
                                <div className="sizes">
                                    {product.sizeOptions.map((s) => (
                                        <button
                                            key={s}
                                            className={`size-btn ${size === s ? "active" : ""}`}
                                            onClick={() => setSize(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="add-to-cart" onClick={() => addCart(product._id)}> 🛒 ADD TO CART </button>

                    {retailer && (
                        <div className="retailer-section" onClick={()=>{retailerProducts(retailer._id)}}>
                            <h2>Sold By</h2>

                            <div className="retailer-card">

                                <img src={`http://localhost:5000/uploads/${retailer.shopImage}`} alt={retailer.shopName} className="retailer-image" />

                                <div className="retailer-info">
                                    <h3>{retailer.shopName}</h3>
                                    <p>{retailer.productType}</p>
                                    <p>
                                        {retailer.address?.city} – {retailer.address?.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <Footer />
        </>
    );
}
