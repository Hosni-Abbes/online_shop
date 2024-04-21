import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "./Context/UserContext";
import axios from "axios";

function Login(){
    const navigate = useNavigate();
    const { user, isLoading, error, dispatch } = useContext(UserContext);
    const [userData, setUserData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async e => {
        e.preventDefault();
        dispatch( { type: "START_LOGIN" } );

        const form = document.getElementById('login_form');
        const formData = new FormData(form);
        formData.append('email', userData.email);
        formData.append('password', userData.password);

        try {
            const response = await axios.post('/api/login', formData);
            if(response.status == 200){
                dispatch( { type: "SUCCESS_LOGIN", payload: response.data } );
                // navigate('/');
            }
        }catch(err){
            dispatch( { type: "FAIL_LOGIN", payload:err } );
            console.log(err);
        }
    }

    // Set Page Title
    document.title = 'Shop - Login'


    return (            
        <div className="container login-register">

            <div className="user-info">
                <div className="top">
                    <h1 className="sh-c-heading">Login</h1>
                    <span className="more-info intro">Login now and set your order.</span>
                    {error? <span className="login_register-err">{ error.response?.data }</span> : null }
                    <form className="user-form" id="login_form" onSubmit={e => handleSubmit(e)} >
                        <input type="text" name="email" autoComplete="email" required placeholder="Email" onChange={ e => setUserData({...userData, email:e.target.value}) } value={userData.email} />
                        <input type="password" name="password" required minLength='8' placeholder="Password" onChange={ e => setUserData({...userData, password:e.target.value}) } value={userData.password} />
                        <input className={isLoading ? 'btn-disable' : ''} type="submit" value={isLoading? '...' : "Login"}  disabled={isLoading}  />
                    </form>
                </div>
                <div className="bottom">
                    <p><Link to="/" className={isLoading ? 'disabled-link': ''} >Click here</Link> To browse our products annonymously! </p>
                    <span>Don't have an account? </span><Link to="/register" className={isLoading ? 'disabled-link': ''} >Register</Link>
                </div>

            </div>



        </div>
    )
}

export default Login;