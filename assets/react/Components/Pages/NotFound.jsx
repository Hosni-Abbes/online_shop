import React from 'react';
import { Link } from "react-router-dom";


function NotFound() {


    // Set Page Title
    document.title = 'Shop - Not Found!';

    return (
        <div className="container">
            <div className="user-info text-center">
                <h1 className="sh-c-heading"> 404 Page not found. </h1>
                <p className='mb-10'>The page you requested is not available.</p>
                <Link to='/' className="back-home-btn">Home page</Link>

            </div>
        </div>
    )

}



export default NotFound;