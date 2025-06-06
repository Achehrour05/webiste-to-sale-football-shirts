import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const location = useLocation();
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    setToken(tokenFromUrl);
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password })
    });
    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div className="reset-form mt-[2.5rem] mb-[1rem] px-[3rem]">
      <p className='text-[1.1rem] font-semibold uppercase tracking-[0.5px] mt-[2.5rem] mb-[1rem] text-[#333]'>Reset Your Password</p>
      <p className='mt-[2.5rem] mb-[1rem] '>Please enter your new password below to reset your account.</p>
      <form onSubmit={handleSubmit}>
        <input type="password" required placeholder="New Password" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" class="bg-white border border-black text-black font-thin mt-10">CONTINUER</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ResetPassword;
