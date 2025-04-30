// src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-gradient"></div>
      
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <h2>Mobi Commerce</h2>
          </div>
          <p>
            Your one-stop destination for premium mobile phones and accessories. 
            We provide the latest tech with unbeatable prices and exceptional customer service.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com/sigmadeveloper" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com/sigmadeveloper" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com/sigmadeveloper" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://www.linkedin.com/in/muhammad-tahir-432635351" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Shop</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
          </ul>
        </div>
        
        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <div className="contact-info">
            <p>
              <FaPhoneAlt />
              +92 3241553013
            </p>
            <p>
              <FaEnvelope />
              tahirsultanofficial@gmail.com
            </p>
            <p>
              <FaMapMarkerAlt />
              123 Commerce Street, Multan, Pakistan
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="copyright">
          &copy; {currentYear} <a href="/">MobiCommerce</a>. All Rights Reserved.
        </div>
        <div className="footer-legal">
          {/* <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;