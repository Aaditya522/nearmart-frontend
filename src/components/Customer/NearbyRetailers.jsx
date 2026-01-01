import React, { useEffect, useState } from "react";
import "./NearbyRetailers.css";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;



const NearbyRetailers = () => {
    const [retailers, setRetailers] = useState([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const loadRetailers = async () => {
        try {
            const res = await fetch(`${API_URL}/nearbyretailers`, {
                credentials: "include"
            });

            const data = await res.json();

            if (!Array.isArray(data)) {
                console.error("Expected array, got:", data);
                setRetailers([]);
                return;
            }

            setRetailers(data);

        } catch (err) {
            console.error("Failed to fetch Retailers", err);
        }
    };

    useEffect(() => {
        loadRetailers();
    }, []);

    // 🔍 Filter logic
    const filteredRetailers = retailers.filter((r) =>
        r.shopName.toLowerCase().includes(search.toLowerCase())
    );


    const retailerProducts = async (retailerId) => {
        console.log("Retailer ID:", retailerId);
        navigate(`/home2/${retailerId}`);
    };


    return (
        <div className="retailers-container">
            <div className="top_bar">
                <h2>Filter via Shop Name:</h2>
                <input type="text" placeholder="Search retailer by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="retailer_search" />
            </div>


            {filteredRetailers.length === 0 && (
                <p>No Retailer Found</p>
            )}

            <div className="retailers">
                {filteredRetailers.map((r) => (
                    <div className="card" key={r._id} onClick={()=>{retailerProducts(r._id)}}>
                        
                        <div className="image_container">
                            <img src={`${API_URL}/uploads/${r.shopImage}`} alt={r.shopName} className="image"/>
                        </div>
                        <div className="title">
                            <span>{r.shopName}</span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default NearbyRetailers;
