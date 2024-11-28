import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SuperAdminProtectedRoute = ({ children }) => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== "super-admin") {
            navigate("/");
        }
    }, []);

    return <>{user && user.role === "super-admin" && children}</>;
};

export default SuperAdminProtectedRoute;
