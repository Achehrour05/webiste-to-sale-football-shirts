import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setMsg(data.message || data.error);
  };

  return (
    <div className="forgot-form mt-[2.5rem] mb-[1rem] px-[3rem]">
      <p className='text-[1.1rem] font-semibold uppercase tracking-[0.5px] mt-[2.5rem] mb-[1rem] text-[#333]'>Forgot Password</p>
      <p className='mt-[2.5rem] mb-[1rem] '>We will send you an email with instructions to reset your password.</p>
      <form onSubmit={handleSubmit}>
        <input type="email" required placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" class="bg-white border border-black text-black font-thin mt-10">CONTINUER</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ForgotPassword;
