import React from 'react';
import { FaHome, FaShoppingCart, FaUsers, FaUserFriends, FaSignOutAlt, FaTicketAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();
  
  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path ? "bg-gray-700" : "";
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-gray-200 flex flex-col p-5 fixed shadow-lg">
      {/* Logo Section */}
      <div className="flex justify-center mb-8">
        <img src="/logo.png" alt="Logo" className="w-28 h-auto rounded-md" />
      </div>

      {/* Menu Section */}
      <div className="flex-1 space-y-1">
        <p className="text-xs uppercase text-gray-400 font-semibold ml-2 mb-2">Main</p>
        <Link to="/">
          <div className={`flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-all duration-200 ${isActive('/')}`}>
            <div className="w-8 flex justify-center">
              <FaHome className="text-xl" />
            </div>
            <span className="text-lg font-medium">Dashboard</span>
          </div>
        </Link>
        
        <div className="py-2">
          <p className="text-xs uppercase text-gray-400 font-semibold ml-2 mb-2">Management</p>
          <Link to="/orders">
            <div className={`flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-all duration-200 ${isActive('/orders')}`}>
              <div className="w-8 flex justify-center">
                <FaShoppingCart className="text-xl" />
              </div>
              <span className="text-lg font-medium">Order History</span>
            </div>
          </Link>
          
          <Link to="/staff">
            <div className={`flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-all duration-200 ${isActive('/staff')}`}>
              <div className="w-8 flex justify-center">
                <FaUsers className="text-xl" />
              </div>
              <span className="text-lg font-medium">Staff</span>
            </div>
          </Link>
          
          <Link to="/users">
            <div className={`flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-all duration-200 ${isActive('/users')}`}>
              <div className="w-8 flex justify-center">
                <FaUserFriends className="text-xl" />
              </div>
              <span className="text-lg font-medium">Users</span>
            </div>
          </Link>
          
          <Link to="/Promocode">
            <div className={`flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-all duration-200 ${isActive('/promocodes')}`}>
              <div className="w-8 flex justify-center">
                <FaTicketAlt className="text-xl" />
              </div>
              <span className="text-lg font-medium">Promocodes</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Logout Section */}
      <div className="mt-auto border-t border-gray-700 pt-5">
        <button 
          className="w-full flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition-all duration-200"
          onClick={() => {
            // Add your logout logic here
            console.log('Logging out...');
            // Example: localStorage.removeItem('token');
            // window.location.href = '/login';
          }}
        >
          <div className="w-8 flex justify-center">
            <FaSignOutAlt className="text-xl" />
          </div>
          <span className="text-lg font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Nav;