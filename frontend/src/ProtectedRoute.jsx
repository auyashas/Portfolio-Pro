import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "./hooks/useSession"; // make sure this file exists and works

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useSession();

    // While user info is loading
    if (loading) return <div>Loading...</div>;

    // If not logged in, redirect to login
    if (!user) return <Navigate to="/login" replace />;

    // If role is restricted
    if (role && user.role !== role) {
        if (user.role === "admin") return <Navigate to="/admin" replace />;
        if (user.role === "freelancer") return <Navigate to={`/freelancer/${user.id}`} replace />;
        if (user.role === "client") return <Navigate to={`/client/${user.id}`} replace />;
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
