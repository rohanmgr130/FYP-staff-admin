import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/api/staff/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        localStorage.setItem('fullname', data.fullname);
        localStorage.setItem('id', data.id);

        alert('Login successful!');
        navigate("/");
      } else {
        setError(data.message || 'Login failed!');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-blue-100">
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-96">
        <div 
          className="absolute top-[-70px] left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-white bg-cover bg-center shadow-lg" 
          style={{ backgroundImage: 'url("https://i.pinimg.com/1200x/9e/95/49/9e9549dcfbafb4a017f179ca1f9c0e46.jpg")' }}
        ></div>
        
        <h2 className="mt-16 text-2xl font-semibold text-gray-800 text-center">Login</h2>

        {/* Email Field with Icon */}
        <div className="relative mt-4">
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 pl-10 mt-2 border rounded-lg text-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password Field with Icon and Toggle Visibility */}
        <div className="relative mt-4">
          <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 pl-10 mt-2 border rounded-lg text-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div 
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            {isPasswordVisible ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </div>
        </div>

        {/* Login Button */}
        <button
          className={`w-full p-3 mt-6 rounded-lg text-lg font-semibold ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Error Message */}
        {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}

        {/* Links */}
        <div className="text-center mt-4">
          <a href="#" className="text-blue-500 text-sm hover:underline">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;