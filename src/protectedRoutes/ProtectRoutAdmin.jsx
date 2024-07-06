import { Navigate } from "react-router-dom";

export const ProtectRouteAdmin = ({children}) =>{
    let user =  JSON.parse(localStorage.getItem("users"))

    if(user.role === "admin"){
        return children;
    } else{
        return <Navigate to={'/signin'}/>
    }
}