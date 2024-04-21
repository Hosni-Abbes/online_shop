import React, {useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../Auth/Context/UserContext";

import HeaderUserMenu from "./HeaderUserMenu";

import { FaShoppingCart } from 'react-icons/fa';
import { IoSettings, IoLogOut } from 'react-icons/io5';
// import {  } from 'react-icons/io5';

function Header({itemsCount, checkoutloading}) {
    const navigate = useNavigate();
    const { user, dispatch } = useContext(UserContext);
    const [renderHeaderMenu, setRenderHeaderMenu] = useState(false);
    const [editProfile, setEditProfile] = useState({
        isEditing: false,
        editUserInfo: false,
        editEmail: false,
        editPass: false,
        editLoading: false,
        editDontClose: false,
        editMessage: '',
    });
    

    // Logout User
    const logout = async () => {
        const formData = new FormData();
        formData.append('userId', sessionStorage.getItem('user'));
        formData.append('sessionId', sessionStorage.getItem('user_id'));
        try{
            const response = await axios.post('/api/logout', formData);
            navigate("/login");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("user_id");
            dispatch( { type: "LOGOUT" } );
          }catch(err){
            console.log(err)
          }
    }


    // Render Header Menu
    const renderingHeaderMenu = () => (
        <div className="header_user-menu">
            <div className="header_user-item" onClick={()=>{ setEditProfile({...editProfile, isEditing:true}); setRenderHeaderMenu(false) } }>
                <span>{<IoSettings />} </span>
                <span>Edit my profile</span>
            </div>
            <div className="header_user-item" onClick={logout}>
                <span>{<IoLogOut />} </span>
                <span >Logout</span>
            </div>
        </div>
    )



    return (
        <>

            {
                user && < HeaderUserMenu setRenderHeaderMenu={setRenderHeaderMenu} editProfile={editProfile} setEditProfile={setEditProfile} />
            }

            <header className="header">
                <nav className="header-nav">
                    <div className="links">
                        <Link exact="true" to="/" className={checkoutloading ? 'disabled-link' : '' }><strong>Shop</strong></Link>
                        <Link to="/cart" className={checkoutloading ? 'disabled-link' : '' } >Cart</Link>
                        {
                            user?.roles?.includes('ADMIN') || user?.roles?.includes('SUPER_ADMIN') ?
                            <Link to="/admin" className={checkoutloading ? 'disabled-link' : '' }>Administration</Link>
                            : ''
                        }

                        
                    </div>
                    <div className="user-nav-info">
                        {
                            user && <span className="nav-user" onClick={()=>setRenderHeaderMenu(!renderHeaderMenu) }>{user?.fname} {user?.lname}</span>
                        }
                        {
                            itemsCount > 0
                            ? <Link to="/cart" className={checkoutloading ? 'header-right disabled-link' : 'header-right' } >
                                <span className="items-incart">{itemsCount}</span>
                                < FaShoppingCart />
                            </Link>
                        : ''
                        }

                        {/* Rendering logout menu */}
                        {
                            renderHeaderMenu && renderingHeaderMenu()
                        }
                        
                    </div>


                </nav>




            </header>

                {   
                    !user && (
                        <div className="sec-nav">
                            <p>You are not connected yet. 
                                <Link to="/register" className={checkoutloading ? 'disabled-link' : '' }> Register</Link> now or 
                                <Link to="/login" className={checkoutloading ? 'disabled-link' : '' }> Login</Link> to join our store.</p>
                        </div>
                    )
                }

        </>
    )
}


export default Header;