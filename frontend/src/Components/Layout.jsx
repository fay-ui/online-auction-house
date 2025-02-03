import React from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow bg-gray-200 py-8">
        <div className="max-w-screen-xl mx-auto px-6 md:px-8">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
}
