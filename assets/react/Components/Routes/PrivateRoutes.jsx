import React, { useContext } from 'react'
import { Outlet } from 'react-router-dom';
import { UserContext } from '../Auth/Context/UserContext';
import NotFound from '../Pages/NotFound';

function PrivateRoutes() {
    const { user } = useContext(UserContext);


    return (user?.roles.includes('ADMIN') || user?.roles.includes('SUPER_ADMIN')) ? <Outlet /> : <NotFound />
}

export default PrivateRoutes