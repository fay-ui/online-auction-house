import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h4 className="text-2xl font-semibold">Auction App</h4>
            <p className="text-sm text-gray-400">Bringing you the best auctions!</p>
          </div>

          {/* Links */}
          <div className="flex space-x-6 justify-center md:justify-end">
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About Us</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</Link>
            <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-300 hover:text-white transition-colors duration-300">Terms of Service</Link>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Auction App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
