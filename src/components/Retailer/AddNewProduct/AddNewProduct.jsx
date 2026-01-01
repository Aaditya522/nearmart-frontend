import { useState } from "react";
const API_URL = process.env.REACT_APP_API_URL;


const AddNewProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    category: "",
    imageUrl: "",
    description: "",
    quantity: ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const {
      productName,
      price,
      category,
      imageUrl,
      description,
      quantity
    } = formData;

    if (
      !productName ||
      !price ||
      !category ||
      !imageUrl ||
      !description ||
      !quantity
    ) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/addNewProduct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productName,
          price: Number(price),
          category,
          imageUrl,
          description,
          quantity: Number(quantity)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      setMessage("✅ Product added successfully");
      setFormData({
        productName: "",
        price: "",
        category: "",
        imageUrl: "",
        description: "",
        quantity: ""
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Add New Product</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input style={styles.input} type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} />

        <input style={styles.input} type="number" min="1" name="price" placeholder="Price (₹)" value={formData.price} onChange={handleChange} />

        <input style={styles.input} type="number" name="quantity" placeholder="Quantity" min="1" value={formData.quantity} onChange={handleChange} />

        <input style={styles.input} type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} />

        <input style={styles.input} type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} />

        <textarea
          style={styles.textarea}
          name="description"
          placeholder="About product..."
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};


const styles = {
  container: {
    width:"95%",
    margin: "40px auto",
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },

  heading: {
    marginBottom: "20px",
    fontWeight: "600",
    color: "#333"
  },

  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "14px"
  },

  input: {
    width: "100%",
    height: "44px",
    padding: "0 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d0d0d0",
    outline: "none"
  },

  textarea: {
    width: "100%",
    minHeight: "90px",
    padding: "10px 12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d0d0d0",
    resize: "vertical",
    outline: "none"
  },

  button: {
    height: "46px",
    marginTop: "10px",
    backgroundColor: "#111827",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.3s"
  },

  success: {
    marginTop: "15px",
    color: "#16a34a",
    fontWeight: "500"
  },

  error: {
    marginTop: "15px",
    color: "#dc2626",
    fontWeight: "500"
  }
};



export default AddNewProduct;