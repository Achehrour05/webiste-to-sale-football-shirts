import React, { useState } from 'react';
import './ContactUs.css'; // Add your existing CSS here

const ContactForm = () => {
  const [theme, setTheme] = useState('light');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const emailIsValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (name.length < 3) return setError('Your name should be at least 3 characters long.');
    if (!email.includes('@') || !email.includes('.') || !emailIsValid(email))
      return setError('Please enter a valid email address.');
    if (message.length < 15) return setError('Please write a longer message.');

    setError('');
    setSuccess('Sending message...');

    try {
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Thank you! I will get back to you as soon as possible.');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while sending the email.');
    }

    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 6000);
  };

  return (
    <div className="contact-container">
      <div className="left-col">
        <img className="logo" src="http://localhost:3000/assets/Real-Madrid-football-club-badge-removebg-preview.png" alt="Logo" />
      </div>
      <div className="right-col">
        <div className="theme-switch-wrapper">
          <label className="theme-switch">
            <input type="checkbox" onChange={toggleTheme} />
            <div className="slider round"></div>
          </label>
          <div className="description">Dark Mode</div>
        </div>
        <h1>Contact us</h1>
        <p>
          Planning to visit our football equipment store soon? Get insider tips on the best gear, top brands, and find unbeatable deals for your next game or training session!
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Your Full Name"
            onChange={handleChange}
            required
          />
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Your Email Address"
            onChange={handleChange}
            required
          />
          <label htmlFor="message">Message</label>
          <textarea
            rows="6"
            name="message"
            value={formData.message}
            placeholder="Your Message"
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Send</button>
        </form>
        {error && <div id="error">{error}</div>}
        {success && <div id="success-msg">{success}</div>}
      </div>
    </div>
  );
};

export default ContactForm;
