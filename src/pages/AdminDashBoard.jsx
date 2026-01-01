import React from "react";
import AllUsers from "../components/Admin/all_users/AdminUsers";
import NavBar from "../components/common/NavBar/NavBar.jsx";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
  return (
    <div>
        <NavBar/>
        <AllUsers/>
    </div>
  );
};

export default Dashboard;