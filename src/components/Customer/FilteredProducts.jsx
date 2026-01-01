import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Products.css";
const API_URL = process.env.REACT_APP_API_URL;


const FilteredProducts = () => {
  const navigate = useNavigate();
  const { retailerId } = useParams();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ================= Fetch products for selected retailer =================
  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/filteredproducts/${retailerId}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch retailer products:", err);
    }
  };

  useEffect(() => {
    if (retailerId) {
      loadProducts();
    }
  }, [retailerId]);

  // ================= Frontend search filter =================
  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    return products.filter((p) =>
      p.productName.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  // ================= Cart =================
  const addCart = async (id) => {
    try {
      const res = await fetch(`${API_URL}/addCart`, {
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

  const openProduct = (productId) => {
    navigate(`/productDetail/${productId}`);
  };

  return (
    <div className="products-container">

      {/* ================= Search Bar (Frontend Filter) ================= */}
      <div className="products-search-retailer">
        <h3>Search with name:</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredProducts.length === 0 && (
        <p>No products available</p>
      )}

      <div className="products">
        {filteredProducts.map((p) => (
          <div
            className="product_card"
            key={p._id}
            onClick={() => openProduct(p._id)}
          >
            <div className="product_image_container">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.productName}
                  className="image"
                />
              ) : (
                "No Image"
              )}
            </div>

            <div className="product_title">
              <span>{p.productName}</span>
            </div>

            <div className="product_action">
              <div className="product_price">
                <span>₹{p.price}/-</span>
              </div>

              <button
                className="product_cart-button"
                onClick={(e) => {
                  e.stopPropagation();
                  addCart(p._id);
                }}
              >
                <svg
                  className="product_cart-icon"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
                <span>Add to cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilteredProducts;
