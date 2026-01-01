import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";
const API_URL = process.env.REACT_APP_API_URL;



const Signup = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    pass: "",
    role: "user",
    address: "",
    city: "",
    pincode: "",

    // Retailer-only
    shopName: "",
    productType: "",
    shopImage: "",
    serviceablePincodes: []
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceableChange = (e) => {
    const pins = e.target.value
      .split(",")
      .map(p => p.trim())
      .filter(Boolean);

    setFormData({ ...formData, serviceablePincodes: pins });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      shopImage: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    Object.keys(formData).forEach(key => {
      if (key === "serviceablePincodes") {
        form.append(key, JSON.stringify(formData[key]));
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        credentials: "include",
        body: form
      });

      const text = await res.text();
      setMessage(text);

      if (formData.role === "user" && text.includes("successful")) {
        navigate("/login");
      }

    } catch (err) {
      console.error(err);
      setMessage("Error submitting form");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h2>Sign-Up</h2>

        <form onSubmit={handleSubmit}>

          <label>Email:<input type="email" name="email" value={formData.email} required onChange={handleChange} /></label>
          <br />

          <label>Name:<input type="text" name="name" value={formData.name} required onChange={handleChange} /></label>
          <br />

          <label>Password:<input type="password" name="pass" value={formData.pass} required onChange={handleChange} /></label>
          <br />

          <label>Role:</label>
          <select name="role" onChange={handleChange}>
            <option value="user">User</option>
            <option value="retailer">Retailer</option>
          </select>

          <label>Address:<input type="text" name="address" value={formData.address} required onChange={handleChange} /></label>
          <br />

          <label>City:<input type="text" name="city" value={formData.city} required onChange={handleChange} /></label>
          <br />

          <label>Pincode:<input type="text" name="pincode" value={formData.pincode} required onChange={handleChange} /></label>
          <br />

          <br />

          {/* -------------------------
            Retailer-only Fields
           ------------------------- */}
          {formData.role === "retailer" && (
            <>
              <label>Shop Name:
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  required
                  onChange={handleChange}
                />
              </label>
              <br />

              <label>Products Type Sold:
                <input
                  type="text"
                  name="productType"
                  value={formData.productType}
                  required
                  onChange={handleChange}
                />
              </label>
              <br />

              <label>
                Shop Image:
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
              </label>
              <br />

              <label>
                Serviceable Pincodes (comma separated, 2–6):
                <input
                  type="text"
                  placeholder="160036,160047,160059"
                  onChange={handleServiceableChange}
                  required
                />
              </label>
              <br /><br />
            </>
          )}

          <button type="submit">Sign Up</button>
        </form>

        {message && <p className="signup-message">{message}</p>}

        <div className="signup-login">
          Already registered?{" "}
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
