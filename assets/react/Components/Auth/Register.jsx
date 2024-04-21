import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { UserContext } from "./Context/UserContext";


function Register(){
    const navigate = useNavigate();
    const { user, isLoading, error, dispatch } = useContext(UserContext);
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        repeatPassword:'',
        fName: '',
        lName: '',
        city: '',
        zip: '',
        address: '',
        phone: '',
    });

    const handleSubmit = async e => {
        e.preventDefault();

        dispatch( { type: "START_LOGIN" } );

        const form = document.getElementById('register_form');
        const formData = new FormData(form);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('repeatPassword', userData.repeatPassword);
        formData.append('fName', userData.fName);
        formData.append('lName', userData.lName);
        formData.append('city', userData.city);
        formData.append('zip', userData.zip);
        formData.append('address', userData.address);
        formData.append('phone', userData.phone);

        try {
            const response = await axios.post('/api/registration', formData);
            if(response.status == 200){
                dispatch( {type: "SUCCESS_REGISTER"} );
                navigate('/success');
            }
        }catch(err){
            dispatch( { type: "FAIL_LOGIN", payload:err } );
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

    }

    

    // Set Page Title
    document.title = 'Shop - Register';
    
    return (
        <div className="container login-register">

            <div className="user-info">
                <div className="top">
                    <h1 className="sh-c-heading">Registration</h1>
                    <span className="more-info intro">Register now and set your order.</span>
                    {error? <span className="login_register-err">{ error.response.data }</span> : null }
                    <form className="user-form" id="register_form" onSubmit={e => handleSubmit(e)} >
                        <input type="text" name="fname" required minLength="3" maxLength="15"   placeholder="First Name" onChange={ e => setUserData({...userData, fName:e.target.value}) }    value={userData.fName} />
                        <input type="text" name="lname" required minLength="3" maxLength="15"  placeholder="Last Name"  onChange={ e => setUserData({...userData, lName:e.target.value}) }    value={userData.lName} />
                        <input type="text" name="email" required    placeholder="Email"      onChange={ e => setUserData({...userData, email:e.target.value}) }    value={userData.email} />
                        <input type="password" name="password" required minLength="8" placeholder="Password"   onChange={ e => setUserData({...userData, password:e.target.value}) } value={userData.password} />
                        <input type="password" name="repeatPassword" required minLength="8" placeholder="Repeat Password"   onChange={ e => setUserData({...userData, repeatPassword:e.target.value}) } value={userData.repeatPassword} />
                        <input type="text" name="address" required  placeholder="Address"    onChange={ e => setUserData({...userData, address:e.target.value}) }  value={userData.address} />
                        <input type="text" name="city" required     placeholder="City"       onChange={ e => setUserData({...userData, city:e.target.value}) }     value={userData.city} />
                        <input type="number" name="zip" required    placeholder="ZIP"        onChange={ e => setUserData({...userData, zip:e.target.value}) }      value={userData.zip} />
                        <input type="text" name="phone" required    placeholder="Phone"      onChange={ e => setUserData({...userData, phone:e.target.value}) }    value={userData.phone} />
                        <input className={isLoading ? 'btn-disable' : ''} type="submit" value={isLoading? '...' : 'Register' } disabled={isLoading} />
                    </form>
                    <span className="more-info rules">By signing up, you agree to our <strong>Terms</strong> , <strong>Data Policy</strong> and <strong>Cookies</strong> Policy .</span>
                </div>
                <div className="bottom">
                    <p><Link to="/" className={isLoading ? 'disabled-link': ''}>Click here</Link> To browse our products annonymously! </p>
                    <span>Already have an account? </span><Link to="/login" className={isLoading ? 'disabled-link': ''}>Log in</Link>
                </div>

            </div>



        </div>
    )
}

export default Register;