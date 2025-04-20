import React from 'react';
import { useNavigate } from 'react-router-dom';

// Minimal custom toast with confirmation support
const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(this.container);
  },

  show(message, options = {}) {
    this.init();

    const toast = document.createElement('div');
    toast.className =
      'bg-gray-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4 animate-fade-in transition-all duration-300';

    toast.innerHTML = `
      <span>${message}</span>
      <div class="flex gap-2">
        <button id="confirmToastBtn" class="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">Yes</button>
        <button id="cancelToastBtn" class="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm">No</button>
      </div>
    `;

    this.container.appendChild(toast);

    // Cleanup after interaction
    const removeToast = () => {
      toast.classList.add('opacity-0', 'translate-x-4');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('#confirmToastBtn').onclick = () => {
      options.onConfirm?.();
      removeToast();
    };

    toast.querySelector('#cancelToastBtn').onclick = () => {
      options.onCancel?.();
      removeToast();
    };
  },
};

function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    Toast.show('Are you sure you want to logout?', {
      onConfirm: () => {
        // Clear session if needed
        // localStorage.removeItem('token');
        navigate('/login');
      },
    });
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Your App</h1>
      </div>

      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          <li>
            <a href="/" className="flex items-center p-3 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/orders" className="flex items-center p-3 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="font-medium">Orders</span>
            </a>
          </li>
          <li>
            <a href="/menu" className="flex items-center p-3 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-medium">Menu Management</span>
            </a>
          </li>
          <li>
            <a href="/settings" className="flex items-center p-3 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">Settings</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-red-300 hover:bg-gray-700 transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}

export default Nav;
