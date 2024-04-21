import React from "react";
import { Link } from "react-router-dom";


function RegistrationMsg() {
    
    return (
    
        <div className="container">
            <div className="text-center" style={{margin: "10% auto"}}>
                <h1 className="sh-c-heading"> Success. </h1>
                <p className="mb-10">Your account has been created successfully.</p>
                <p className="mb-10">Please activate your account by clicking on link we just sended it to your e-mail address.</p>
                <Link to='/login' className="back-home-btn">Login page</Link>
                
            </div>

        </div>

)};


export default RegistrationMsg;