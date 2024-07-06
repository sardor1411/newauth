import { Navigate } from "react-router-dom";

export const ProtectRouteAdmin = ({ children }) => {
    let user = JSON.parse(localStorage.getItem("users"));

    if (user && user.role === "admin") {
        return children;
    } else {
        console.log('error');
        return <Navigate to={'/signin'} />;
    }
};
