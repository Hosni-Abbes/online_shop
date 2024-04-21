import React, { useContext } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom"
import { UserContext } from "../Auth/Context/UserContext";


function NotAuthRoutes() {
    const { user } = useContext(UserContext);
    const location = useLocation()

    
    return (
        !user 
        ? <Outlet /> 
        : <Navigate to={location?.state?.from?.pathname || '/'} state={{from: location}} replace />
    )
}

export default NotAuthRoutes