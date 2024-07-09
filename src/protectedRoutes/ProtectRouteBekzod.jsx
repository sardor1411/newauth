import { Navigate } from "react-router-dom";

export const ProtectRouteBekzod = ({children}) => {
    let user = localStorage.getItem("users");
    if (user) {
        user = JSON.parse(user);
    }
    if (user && (user.role === "bekzod" || user.role === "admin")) {
        return children;
    } else {
        return <Navigate to='/signin' />;
    }
};
