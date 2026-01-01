import React, { useEffect, useMemo, useState } from "react";
import "./Products.css";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;


const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("none");

  // ================= Load default nearby products =================
  const loadProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
  if (search.trim() === "") {
    loadProducts();
  }
}, [search]);


  // ================= Search nearby products =================
  const searchProducts = async () => {
    if (!search.trim()) {
      loadProducts();
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/products/search?query=${search}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= Derived filters =================
  const categories = useMemo(() => {
    const cats = products.map(p => p.category).filter(Boolean);
    return ["all", ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (category !== "all") {
      data = data.filter(p => p.category === category);
    }

    if (sort === "low") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [products, category, sort]);

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

      {/* ================= Search Bar ================= */}
      <div className="products-search">
        <input type="text" placeholder="Search products..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchProducts()} />
        <button onClick={searchProducts}>{loading ? "Searching..." : "Search"}</button>
      </div>

      {/* ================= Sidebar ================= */}
      <aside className="sidebar">
        <h4>Filters</h4>

        <div className="fields">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by Price</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="none">None</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>
          </div>
        </div>
      </aside>

      {/* ================= Products ================= */}
      
      {filteredProducts.length === 0 && !loading && (
        <p>No nearby products found</p>
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
                <span>Add to cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Products;
