import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [user, setUser] = useState(null);

  // Check karo agar URL mein Google login ke baad token aaya hai
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      alert('Google Login Successful!');
      setUser({ token });
    } else {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        setUser({ token: savedToken });
      }
    }
  }, []);

  // Manual Signup / Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
        alert('Signup Successful! Please Login.');
        setIsSignup(false);
      } else {
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        setUser(response.data);
        alert('Login Successful!');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Something went wrong!');
    }
  };

  // Google Login Button Handler
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    alert('Logged out successfully!');
  };

  if (user) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial' }}>
        <h2>🎉 Welcome! You are logged in successfully.</h2>
        <button 
          onClick={handleLogout} 
          style={{ padding: '10px 20px', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', fontFamily: 'Arial', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      <h2>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {isSignup && (
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ padding: '10px', fontSize: '16px' }}
          />
        )}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button 
          type="submit" 
          style={{ padding: '10px', fontSize: '16px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {isSignup ? 'Register' : 'Sign In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span 
          onClick={() => setIsSignup(!isSignup)} 
          style={{ color: '#007BFF', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isSignup ? 'Sign In' : 'Sign Up'}
        </span>
      </p>

      <hr style={{ margin: '20px 0' }} />

      {/* Google Sign-In Button */}
      <button 
        onClick={handleGoogleLogin} 
        style={{ width: '100%', padding: '10px', backgroundColor: '#4285F4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default App;