import React from 'react';
import { Link } from "react-router-dom";


function UserVerification(){


    return (
        <div className="container">
            <div className="text-center" style={{margin: "10% auto"}}>
                <h3 className="sh-c-heading"> Success. </h3>
                <p className='mb-10'>Your account is Verified.</p>
                <p> <Link to='/login'>Login</Link> to your account.</p>

            </div>

        </div>
    )
}



export default UserVerification;