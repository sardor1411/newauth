import { Navigate } from "react-router-dom";
import { Bekzod } from "../page/Bekzod";

export const ProtectRouteBekzod = ({children}) => {
    let user = JSON.parse(localStorage.getItem("users"));

    if (user && user.role === "bekzod") {
        return children;
    } else {
        console.log('sa');
        return <Navigate to={'/signin'} />;
    }
};
