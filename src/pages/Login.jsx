import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // IMPORTANT for session
        body: JSON.stringify({ email, pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        alert(data.message);
        return;
      }

      if(data.role === "user"){
        alert(`You are Logged-In as, Customer`);
      }
      else{
        alert(`You are Logged-In as, ${data.role}`);
      }

      // console.log(data.role);

      // Redirect based on role
      switch (data.role) {
        case "admin":
          navigate("/adminDashboard");
          break;

        case "retailer":
          navigate("/retailerDashboard");
          break;

        default:
          navigate("/home");
      }

    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p className="error">{message}</p>}

        <div className="signup-login">
          Not Registered?{" "}
          <button onClick={() => navigate("/signup")}>SignUp</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
