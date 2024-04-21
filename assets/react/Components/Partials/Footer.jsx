import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaLinkedinIn } from 'react-icons/fa';


function Footer() {

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="contact">
                    <p><strong>Get in touch.</strong></p>
                    <a href="mailto: admin.shop@site.com" >admin.shop@site.com</a>
                </div>
                <div className="links">
                    <p>Join us on social media.</p>
                    <Link  to="http://www.linkedin.com"> < FaLinkedinIn /> </Link>
                    <Link  to="http://www.facebook.com"> < FaFacebookF /> </Link>
                    <Link  to="http://www.twitter.com"> < FaTwitter /> </Link>
                </div>
            </div>
            <div className="footer-bottom">
                <p>Copyright &copy; - Shop.</p>
            </div>
        </footer>
    )
}



export default Footer;