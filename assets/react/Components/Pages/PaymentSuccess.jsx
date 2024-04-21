import React from 'react';
import { Link } from "react-router-dom";


function PaymentSuccess(){


    return (
        <div className='container mb-1rem text-center' style={{margin: '10% auto'}}>
            <h3 className='sh-c-heading mb-10'>Successful payment.</h3>
            <p className='mb-10'>Thank you for ordering from our shop. Please note that your payment has been confirmed and your order is being processed.</p>
            <p className='mb-10'>An e-mail with more details has been sent to your e-mail address.</p>
            <h4 className='sh-c-heading'>Welcome!</h4>
            <Link to="/" className='back-home-btn'>Home page</Link>
        </div>
    )
}



export default PaymentSuccess;