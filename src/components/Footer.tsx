// src/components/Footer.jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="p-10 bg-gray-900 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-52 px-64">
        {/* Links */}
        <div className="flex flex-col space-y-2">
          <Link to={"/"} className="text-gray-400 hover:text-gray-300">Home</Link>
          <Link to={"/contact"} className="text-gray-400 hover:text-gray-300">Contact</Link>
          <Link to={"/about"} className="text-gray-400 hover:text-gray-300">About</Link>
          <Link to={"/search"} className="text-gray-400 hover:text-gray-300">Search</Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold text-white">Follow Us</h3>
          <div className="flex flex-col mt-2">
            <a href="https://facebook.com/sigmadeveloper" className="text-gray-400 hover:text-gray-300">Facebook</a>
            <a href="https://instagram.com/tahirsultanofficial" className="text-gray-400 hover:text-gray-300">Instagram</a>
            <a href="https://www.linkedin.com/in/muhammad-tahir-432635351" className="text-gray-400 hover:text-gray-300">LinkedIn</a>
            <a href="https://x.com" className="text-gray-400 hover:text-gray-300">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} MobiCommerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;