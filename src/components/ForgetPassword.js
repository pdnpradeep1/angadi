import React from 'react';
import { useState } from 'react';
import '../styles/forgotpassword.css'; 

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send an email to reset password
    console.log('Email:', email);
    setTimeout(() => {
        if (email.includes('@')) {
          setSuccess(true);
          setError(null);
          setEmail('');
        } else {
          setError('Please enter a valid email address');
        }
      }, 500);

      const url = new URL('http://localhost:8080/auth/forgot-password');
      url.searchParams.append('email', email);

     fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        //   body: JSON.stringify({ email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
        }else{
            if (response.body === 'failed') {
                throw new Error('Invalid email');
                }
        }
        return response.json();
    })
        .then(data => {
          console.log('sent success:', data);
          setSuccess(true);
          setError(null);
        })
        .catch(error => {
          console.error('Error logging in:', error)
          setError('Please enter a valid email address');
          setSuccess(false);
          // Handle login error (e.g., show error message)
        });
      };

  return (
    <div className="forget-password-page">
      <h2>Forget Password</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">Check your email for reset instructions.</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgetPassword;