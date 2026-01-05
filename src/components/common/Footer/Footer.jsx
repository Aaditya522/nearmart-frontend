import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";
const API_URL = process.env.REACT_APP_API_URL;



const Footer = () => {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState("");

  const [editAddress, setEditAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    at: "",
    city: "",
    pincode: ""
  });

  // Fetch user details when profile opens
  useEffect(() => {
    if (!showProfile) return;

    setLoading(true);

    fetch(`${API_URL}/userDetails`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Not logged in");
          setUserData(null);
        } else {
          setUserData(data);
          setAddressForm({
            at: data.address?.at || "",
            city: data.address?.city || "",
            pincode: data.address?.pincode || ""
          });
          setMessage("");
        }
      })
      .catch(() => {
        setMessage("Unable to fetch user details");
        setUserData(null);
      })
      .finally(() => setLoading(false));
  }, [showProfile]);

  // Update address handler
  const updateAddress = async () => {
    if (!addressForm.at || !addressForm.city || !addressForm.pincode) {
      setMessage("All address fields are required");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/user/updateAddress`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressForm),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to update address");
        return;
      }

      setUserData((prev) => ({
        ...prev,
        address: data.address,
      }));

      setEditAddress(false);
      setMessage("Address updated successfully");
    } catch {
      setMessage("Unable to update address");
    }
  };





  return (
    <>
      {showProfile && (
        <div className="profile-drawer">
          {loading && <p>Loading profile...</p>}

          {!loading && message && (
            <p className="profile-message">{message}</p>
          )}

          {!loading && userData && (
            <div className="profile-content">
              <h3>{userData.name}</h3>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Phone:</strong> {userData.phone} </p>

              <p><strong>Address:</strong></p>

              {!editAddress ? (<>
                <p>
                  {userData.address?.at}, {userData.address?.city} –{" "}
                  {userData.address?.pincode}
                </p>
                <button className="edit-btn"
                  onClick={() => setEditAddress(true)}
                >Edit Address</button>
              </>
              ) : (
                <div className="address-edit">
                  <input type="text" placeholder="Base Address" value={addressForm.at}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, at: e.target.value })
                    }
                  />

                  <input type="text" placeholder="City" value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                  />

                  <input type="text" placeholder="Pincode" value={addressForm.pincode}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, pincode: e.target.value })
                    }
                  />

                  <div className="address-actions">
                    <button onClick={updateAddress}>Save</button>
                    <button onClick={() => setEditAddress(false)}>  Cancel</button>
                  </div>
                </div>
              )}

              {userData.role === "user" && (
                <p><strong>Role:</strong> Customer</p>
              )}

              {userData.role === "retailer" && (
                <>
                  <p><strong>Role:</strong> Retailer</p>
                  <p><strong>Shop:</strong> {userData.shopName}</p>
                  <p><strong>Category:</strong> {userData.productType}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}



      <footer className="footer">
        <div className="btn" onClick={() => setShowProfile((prev) => !prev)}>
          <span>👤 Profile</span>
        </div>

        <div onClick={() => navigate("/cart")} className="btn">
          <span>🛒 Cart</span>
        </div>

        <div onClick={() => navigate("/myOrders")} className="btn">
          <span>📦 Orders</span>
        </div>

      </footer>
    </>
  );
};

export default Footer;
