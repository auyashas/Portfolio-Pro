import React from "react";
import { useParams } from "react-router-dom";
import "../styles/HomeStyles.css";

const ClientHome = () => {
    const { id } = useParams();

    return (
        <div className="user-home">
            <h1>Welcome, Client {id}!</h1>
            <p>You can view freelancers and post job requests.</p>
        </div>
    );
};

export default ClientHome;
