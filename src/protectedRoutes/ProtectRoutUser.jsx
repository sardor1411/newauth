import { Navigate } from "react-router-dom";

export const ProtectRouteUser = ({children}) =>{
    let user =  JSON.parse(localStorage.getItem("users"))

    if(user){
        return children;
    } else{
        return <Navigate to={'/signin'}/>
    }
}