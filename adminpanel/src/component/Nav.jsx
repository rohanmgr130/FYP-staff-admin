import React from 'react';
import { FaHome, FaShoppingCart, FaUsers, FaChartBar, FaCogs, FaSignOutAlt } from 'react-icons/fa'; // Icons
import { Link } from 'react-router-dom';


const Nav = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-gray-200 flex flex-col p-5 fixed">
      {/* Logo Section */}
      <div className="flex justify-center mb-10">
        <img src="logo.png" alt="Logo" className="w-28 h-auto" /> {/* Replace with your logo */}
      </div>

      {/* Menu Section */}
      <div className="flex-1 space-y-5">
        <Link to={"/"}>
          <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
            <FaHome className="text-xl" />
            <span className="text-lg">Dashboard</span>
          </div>
        </Link>
       
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
          <FaShoppingCart className="text-xl" />
          <span className="text-lg">Order History</span>
        </div>
        <Link to={"/staff"}>
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
          <FaUsers className="text-xl" />
          <span className="text-lg">Staff</span>
        </div>
        </Link>
       
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
          <FaChartBar className="text-xl" />
          <span className="text-lg">Sales</span>
        </div>
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
          <FaCogs className="text-xl" />
          <span className="text-lg">Settings</span>
        </div>
      </div>

      {/* Logout Section */}
      <div className="mt-auto border-t border-gray-700 pt-5">
        <div className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 cursor-pointer">
          <FaSignOutAlt className="text-xl" />
          <span className="text-lg">Log Out</span>
        </div>
      </div>
    </div>
  );
};

export default Nav;
