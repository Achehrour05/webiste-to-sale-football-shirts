// src/ContactForm.js
import React, { useState } from 'react';
import axios from 'axios';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/contact', form);
      setResponse(res.data.message);
    } catch (err) {
      if (err.response?.data?.errors) {
        setResponse('Validation failed.');
        console.log(err.response.data.errors);
      } else {
        setResponse('Something went wrong.');
      }
    }
  };

  return (
    <div>
      <h2>Contact Form</h2>
      {response && <p>{response}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required /><br />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required /><br />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required></textarea><br />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default ContactForm;
