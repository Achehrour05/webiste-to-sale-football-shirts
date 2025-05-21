import React, { useState, useContext } from 'react';
import { FaFacebookF, FaGooglePlusG, FaLinkedinIn } from 'react-icons/fa';
import './Signupcss.css';
import { AuthProvider } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const { login } = useContext(AuthProvider);
  const nav = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || 'Inscription réussie ! Please sign in.');
        setMessageType('success');
        setIsRightPanelActive(false);
        setRegisterData({ name: '', email: '', password: '' });
      } else {
        setMessage(data.error || 'Erreur lors de l’inscription.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur.');
      setMessageType('error');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.user);
        setLoginData({ email: '', password: '' });
        nav('/');
      } else {
        setMessage(data.error || 'Erreur lors de la connexion.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur.');
      setMessageType('error');
    }
  };

  return (
    <div className="auth-form-body">
      <div className={`auth-form-main-container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
        <div className="auth-form-panel auth-form-panel--sign-up">
          <form onSubmit={handleRegisterSubmit} className="auth-form-content">
            <h1 className="auth-form-title auth-form-title--form">CREATE<br />ACCOUNT</h1>
            <div className="auth-form-social-links">
              <button type="button" className="auth-form-social-button"><FaFacebookF /></button>
              <button type="button" className="auth-form-social-button"><FaGooglePlusG /></button>
              <button type="button" className="auth-form-social-button"><FaLinkedinIn /></button>
            </div>
            <span className="auth-form-helper-text">or use your email for registration</span>
            <input type="text" name="name" value={registerData.name} onChange={handleRegisterChange} required placeholder="Name" className="auth-form-input-field" />
            <input type="email" name="email" value={registerData.email} onChange={handleRegisterChange} required placeholder="Email" className="auth-form-input-field" />
            <input type="password" name="password" value={registerData.password} onChange={handleRegisterChange} required placeholder="Password" className="auth-form-input-field" />
            <button className="auth-form-action-button" type="submit">Sign Up</button>
          </form>
        </div>

        <div className="auth-form-panel auth-form-panel--sign-in">
          <form onSubmit={handleLoginSubmit} className="auth-form-content">
            <h1 className="auth-form-title auth-form-title--form">SIGN IN</h1>
            <div className="auth-form-social-links">
              <button type="button" className="auth-form-social-button"><FaFacebookF /></button>
              <button type="button" className="auth-form-social-button"><FaGooglePlusG /></button>
              <button type="button" className="auth-form-social-button"><FaLinkedinIn /></button>
            </div>
            <span className="auth-form-helper-text">or use your account</span>
            <input type="email" name="email" value={loginData.email} onChange={handleLoginChange} required placeholder="Email" className="auth-form-input-field" />
            <input type="password" name="password" value={loginData.password} onChange={handleLoginChange} required placeholder="Password" className="auth-form-input-field" />
            <a href="/forget-pass" className="auth-form-link">Forgot your password?</a>
            <button className="auth-form-action-button" type="submit">Sign In</button>
          </form>
        </div>

        <div className="auth-form-overlay-container">
          <div className="auth-form-overlay-background">
            <div className="auth-form-overlay-content-panel auth-form-overlay-content-panel--left">
              <h1 className="auth-form-title auth-form-title--overlay">WELCOME<br />BACK!</h1>
              <p className="auth-form-overlay-paragraph">To keep connected with us please login with your personal info</p>
              <button className="auth-form-action-button auth-form-action-button--ghost" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="auth-form-overlay-content-panel auth-form-overlay-content-panel--right">
              <h1 className="auth-form-title auth-form-title--overlay">HELLO,<br />FRIEND!</h1>
              <p className="auth-form-overlay-paragraph">Enter your personal details and start journey with us</p>
              <button className="auth-form-action-button auth-form-action-button--ghost" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <p className={`auth-form-feedback-message ${messageType === 'success' ? 'auth-form-feedback-message--success' : 'auth-form-feedback-message--error'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoginForm;
