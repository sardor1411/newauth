import { Navigate } from "react-router-dom";

export const ProtectRouteUser = ({ children }) => {
    let user = JSON.parse(localStorage.getItem("users"));

    if (user) {
        console.log('ok');
        return children;
    } else {
        console.log('not ok');
        return <Navigate to={'/signin'} />;
    }
};
