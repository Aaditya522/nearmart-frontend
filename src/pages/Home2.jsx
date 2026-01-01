import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Home.css";

import NavBar from "../components/common/NavBar/NavBar.jsx";
import Footer from "../components/common/Footer/Footer.jsx";

import FilteredProducts from "../components/Customer/FilteredProducts";
import NearbyRetailers from "../components/Customer/NearbyRetailers";
const API_URL = process.env.REACT_APP_API_URL;


const Home2 = () => {
    const [retailer, setRetailer] = useState(null);
    const { retailerId } = useParams();

    const retailerDetails = async () => {
        try {
            const res = await fetch(`${API_URL}/retailerDetails/${retailerId}`,
                {credentials: "include"}
            );
            console.log("Status:", res.status);

            const data = await res.json();
            console.log("Retailer API response:", data);

            setRetailer(data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        if (retailerId) {
            retailerDetails();
        }
    }, [retailerId]);

    return (
        <>
            <NavBar />
            <div className="container1">
                {retailer ? <div className="details">

                    <div className="image_div">
                        <img src={`${API_URL}/uploads/${retailer.shopImage}`} alt={retailer.shopName} className="image" />
                    </div>

                    <div className="main-details">
                        <h1>{retailer.shopName}</h1>
                    </div>

                </div> : <h3>Loading...</h3>}
                <FilteredProducts retailerId={retailerId} />
                <NearbyRetailers />

                {retailer ? <div className="address">
                    <div className="category">
                        <h3>Category:</h3>
                        <p>{retailer.productType}</p>
                    </div>

                    <br/>

                    <div>
                        <h3>Shop Address: </h3>
                        <p>{retailer.address.at}, {retailer.address.city}</p>
                        <p>{retailer.address.pincode}</p>
                    </div>
                </div> : <h3>Loading...</h3>}
            </div>
            <Footer />
        </>
    );
};

export default Home2;
