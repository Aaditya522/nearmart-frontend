import React, { useEffect, useState } from "react";
import "./AdminUsers.css";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;

const AdminUsers = () => {

  const navigate = useNavigate();


  const [users, setUsers] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [unblockedUsers, setUnblockedUsers] = useState([]); //Retailers
  const [blockedNormalUsers, setBlockedNormalUsers] = useState([]);
  const [unblockedNormalUsers, setUnblockedNormalUsers] = useState([]);//Non-Retailers(Normal Customers);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSection, setActiveSection] = useState("retailers"); // "retailers" | "users" sections tab
  const [totalRetailers, setTotalRetailers] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);

  // Load all users from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();

      setUsers(data); //allUsers;

      const unblocked = data.filter(u => !u.block && u.role === "retailer");
      setUnblockedUsers(unblocked); //unblocked users;

      const blocked = data.filter(u => u.block && u.role === "retailer");
      setBlockedUsers(blocked);  //blocked users;


      // NORMAL USERS
      const unblockedUsers = data.filter(
        u => !u.block && u.role === "user"
      );
      const blockedUsers = data.filter(
        u => u.block && u.role === "user"
      );

      setUnblockedNormalUsers(unblockedUsers);
      setBlockedNormalUsers(blockedUsers);

      setTotalRetailers(unblocked.length + blocked.length);
      setTotalCustomers(unblockedUsers.length + blockedUsers.length);

    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Block or unblock a user
  const handleBlockToggle = async (id) => {
    try {
      const res = await fetch(`${API_URL}/block_unblock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userid: id }),
      });

      const result = await res.json();
      alert(result.message);

      // Refresh user list after update
      fetchUsers();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };


  async function fetchRequests() {
    try {
      const res = await fetch(`${API_URL}/api/pendingRetailers`);
      const data = await res.json();

      setPendingRequests(data);

      setTotalRequests(data.length);
    }
    catch (err) {
      console.error("Failed to load requests", err);
    }
  }

  useEffect(() => { //retailer's requests;
    fetchRequests();
  }, []);


  const handleApprove = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/api/approveRetailer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: id }),
      });

      const result = await res.json();
      alert(result.message);

      // Refresh user list after update
      fetchRequests();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/rejectRetailer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId: id }),
      });

      const result = await res.json();
      alert(result.message);

      // Refresh user list after update
      fetchRequests();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };




  const fetchOrders = async () => { //Fetch all orders.
    try {
      const res = await fetch(`${API_URL}/api/admin/orders`, {
        credentials: "include",
      });
      const data = await res.json();
      setOrders(data);
      setTotalOrders(data.length);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    if (activeSection === "orders") {
      fetchOrders();
    }
  }, [activeSection]);


  const updateOrderStatus = async (orderId, status) => { //update order status.
    try {
      const res = await fetch(`${API_URL}/api/admin/updateOrderStatus`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ orderId, status }),
        }
      );

      const result = await res.json();
      alert(result.message);
      fetchOrders();
    } catch (err) {
      console.error("Order update failed", err);
    }
  };



  return (
    <div className="admin-container">

      <div className="main-tabs">
        <button className={activeSection === "retailers" ? "active" : ""} onClick={() => setActiveSection("retailers")}> Retailers </button>
        <button className={activeSection === "users" ? "active" : ""} onClick={() => setActiveSection("users")}>Customers</button>
        <button className={activeSection === "orders" ? "active" : ""} onClick={() => setActiveSection("orders")}>Orders</button>
      </div>


      {/* ================= Retailers SECTION ================= */}
      {activeSection === "retailers" && (
        <section className="admin-section">
          <h1 className="section-title">Retailer Management</h1>
          <div className="flex-div"> {/*parent flex container*/}


            <div className="left"> {/* left Features-div */}

              <button className="add-user-btn" onClick={() => navigate("/addRetailer")}>Add New Account</button>

              <div className="analytics">
                <div className="totalUsers">
                  <p>Total Retailers:</p>
                  <h2>{totalRetailers}</h2>
                </div>

                <div className="totalUsers">
                  <p>Pending Requests:</p>
                  <h2>{totalRequests}</h2>
                </div>
              </div>

              <div>
                <div className="scrollable">
                  <h2 className="fixed">Pending Requests</h2>
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>name</th>
                        <th>email</th>
                        <th>Shop</th>
                        <th>Products</th>
                        <th>Address</th>
                        <th>Approve</th>
                        <th>Reject</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingRequests.map((retailer) => (
                        <tr key={retailer._id}>
                          <td>{retailer.name}</td>
                          <td>{retailer.email}</td>
                          <td>{retailer.shopName}</td>
                          <td>{retailer.productType}</td>
                          <td>{retailer.address.at + ", " + retailer.address.city + ", " + retailer.address.pincode}</td>
                          <td><button onClick={() => handleApprove(retailer._id.toString())}>Approve</button></td>
                          <td><button onClick={() => handleReject(retailer._id.toString())}> Reject</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>  {/* left Features-div */}


            <div className="right"> {/* right Users-div */}
              <div className="scrollable">
                <h2 className="fixed">Blocked Retailers</h2>
                <table className="user-table">

                  <thead>
                    <tr>
                      <th>name</th>
                      <th>email</th>
                      <th>pass</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {blockedUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.pass}</td>
                        <td>
                          <button onClick={() => handleBlockToggle(u._id)}>UnBlock</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table></div>


              <div className="scrollable">
                <h2 className="fixed">Unblocked Retailers</h2>
                <table className="user-table">
                  <thead>

                    <tr>
                      <th>name</th>
                      <th>email</th>
                      <th>pass</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {unblockedUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.pass}</td>
                        <td>
                          <button onClick={() => handleBlockToggle(u._id)}>Block</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            </div> {/* right Users-div */}

          </div>{/* Section 1 */}
        </section>
      )}


      {/* ================= Customer SECTION ================= */}

      {activeSection === "users" && (
        <section className="admin-section">
          <h1 className="section-title">Customer Management</h1>
          <div className="flex-div">

            {/* LEFT EMPTY DIV */}
            {/* <div className="left">

              <div className="analytics">
                <div className="totalUsers">
                  <p>Total Customers:</p>
                  <h2>{totalCustomers}</h2>
                </div>

              </div>
            </div> */}

            {/* RIGHT USERS DIV */}
            <div className="right">

              <div className="totalUsers">
                <p>Total Customers:</p>
                <h2>{totalCustomers}</h2>
              </div>

              {/* BLOCKED USERS */}
              <div className="scrollable">

                <h2 className="fixed">Blocked Users</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>email</th>
                      <th>pass</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {blockedNormalUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.pass}</td>
                        <td>
                          <button onClick={() => handleBlockToggle(u._id)}>
                            UnBlock
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* UNBLOCKED USERS */}
              <div className="scrollable">
                <h2 className="fixed">Unblocked Users</h2>
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>name</th>
                      <th>email</th>
                      <th>pass</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {unblockedNormalUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.pass}</td>
                        <td>
                          <button onClick={() => handleBlockToggle(u._id)}>
                            Block
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </section>
      )}
      {/* Section 2 */}


      {/* ================= ORDERS SECTION ================= */}
      {activeSection === "orders" && (
        <section className="admin-section">
          <h1 className="section-title">Order Management</h1>
              
              <div className="totalUsers">
                <p>Total Orders:</p>
                <h2>{totalOrders}</h2>
              </div>

          <div className="scrollable">
            <table className="user-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Retailer</th>
                  <th>Shop</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.userId?.name}</td>
                    <td>{order.retailerId?.name}</td>
                    <td>{order.retailerId?.shopName}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>{order.payment.status}</td>
                    <td>{order.orderStatus}</td>

                    <td>
                      <button onClick={() => updateOrderStatus(order._id, "PLACED")}>Placed</button>
                      <button onClick={() => updateOrderStatus(order._id, "CONFIRMED")}>Confirm</button>
                      <button onClick={() => updateOrderStatus(order._id, "CANCELLED")}>Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

    </div>
  );
};

export default AdminUsers;

