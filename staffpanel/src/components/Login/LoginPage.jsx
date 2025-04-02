import React, { useState } from 'react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4000/login", {
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
        // Assuming you store the JWT token in localStorage for this example
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        // Redirect to the home page or dashboard
        window.location.href = '/';  // or wherever you want to redirect
      } else {
        setError(data.message || 'Login failed!');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'linear-gradient(135deg, #f3e7e9, #e3eeff)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      padding: '30px',
      borderRadius: '15px',
      boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      width: '350px',
      position: 'relative',
    },
    image: {
      position: 'absolute',
      top: '-70px',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      backgroundColor: '#fff',
      backgroundImage: 'url("https://source.unsplash.com/100x100/?order,food")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    heading: {
      marginTop: '50px', // Adjust for image overlap
      fontSize: '24px',
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: '12px',
      margin: '10px 0',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '16px',
    },
    button: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#28a745',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      marginTop: '20px',
      transition: 'background 0.3s',
    },
    buttonLoading: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#cccccc',
      color: '#ffffff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'not-allowed',
      marginTop: '20px',
    },
    link: {
      marginTop: '10px',
      fontSize: '14px',
      color: '#007bff',
      textDecoration: 'none',
    },
    error: {
      color: 'red',
      fontSize: '14px',
      textAlign: 'center',
      marginTop: '10px',
    },
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.form}>
        <h2 style={styles.heading}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          style={loading ? styles.buttonLoading : styles.button} 
          onClick={handleLogin} 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <div style={styles.error}>{error}</div>}
        <a href="#" style={styles.link}>Forgot Password?</a>
      </div>
    </div>
  );
};

export default LoginPage;
