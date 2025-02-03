import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Toggle the mobile menu
  const toggleMenu = () => setIsOpen(!isOpen);

  // Helper to check if the link is active
  const isActive = (path) =>
    location.pathname === path ? 'bg-blue-700 text-white' : 'text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700';

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Auction Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Auction Online</span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen ? 'true' : 'false'}
          onClick={toggleMenu}
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        <div className={`md:flex ${isOpen ? 'block' : 'hidden'} w-full md:w-auto transition-all duration-300`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link
                to="/"
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/')}`}
                aria-current={location.pathname === '/' ? 'page' : undefined}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/profile')}`}
                aria-current={location.pathname === '/profile' ? 'page' : undefined}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/register')}`}
                aria-current={location.pathname === '/register' ? 'page' : undefined}
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={`block py-2 px-3 rounded md:p-0 ${isActive('/login')}`}
                aria-current={location.pathname === '/login' ? 'page' : undefined}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
