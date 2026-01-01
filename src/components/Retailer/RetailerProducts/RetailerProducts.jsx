import { useEffect, useState } from "react";
import "./RetailerProducts.css";
const API_URL = process.env.REACT_APP_API_URL;


const RetailerProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editValues, setEditValues] = useState({});

  // Fetch retailer products
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/retailerProducts`, {
          method: "GET",
          credentials: "include"
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch products");
      }

      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔍 Filter products by name
  useEffect(() => {
    const filtered = products.filter(p => p.productName.toLowerCase().includes(search.toLowerCase()));
    setFilteredProducts(filtered);
  }, [search, products]);


  //update_product
  const updateProduct = async (id) => {
    const updates = editValues[id];

    if (!updates) {
      alert("No changes made");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/update_product/${id}`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            price: Number(updates.price),
            quantity: Number(updates.quantity)
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      // Update UI
      setProducts(prev => prev.map(p => p._id === id ? data.product : p));
      setFilteredProducts(prev => prev.map(p => p._id === id ? data.product : p));

      alert("Product updated successfully");

    } catch (err) {
      alert(err.message);
    }
  };


  // Remove product
  const removeProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?\nThis action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}/deleteProduct/${id}`,{
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      }

      setProducts(prev => prev.filter(p => p._id !== id));
      setFilteredProducts(prev => prev.filter(p => p._id !== id));

      alert("Product deleted successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditValues(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="retailer-container">
      <div className="top_bar">
        <h2>Your Products</h2>

        <input
          type="text"
          placeholder="Search product by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="product-search"
        />
      </div>


      {filteredProducts.length === 0 ? (
        <p>No products found</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.productName}
                      className="product-image"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>

                <td>{p.productName}</td>

                <td>
                  <input type="number" min="0" value={editValues[p._id]?.quantity ?? p.quantity}
                    onChange={(e) => handleEditChange(p._id, "quantity", e.target.value)} className="edit-input" />
                </td>

                <td>
                  <input type="number" min="0" value={editValues[p._id]?.price ?? p.price}
                    onChange={(e) => handleEditChange(p._id, "price", e.target.value)} className="edit-input" />
                </td>

                <td>
                  <button className="update-btn" onClick={() => updateProduct(p._id)}>Update</button>
                  <button className="delete-btn" onClick={() => removeProduct(p._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RetailerProducts;
