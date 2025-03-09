import './Signupcss.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  let [name, setName] = useState('Sign Up'); // Form name (Sign Up or Login)
  let id = useRef(null);
  let [change, setChange] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  function handleSignUp() {
    setName('Sign Up');
  }

  function handleLogin() {
    setName('Login');
  }

  function handle(e) {
    const { name, value } = e.target;
    setChange({ ...change, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const data = name === 'Sign Up'
      ? { name: change.name, email: change.email, password: change.password }
      : { email: change.email, password: change.password };

    console.log('Data being sent to the backend:', data);

    try {
      const endpoint = name === 'Sign Up'
        ? 'http://localhost:5000/registration/signup'
        : 'http://localhost:5000/registration/login';

      const response = await axios.post(endpoint, data, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Response from backend:', response.data);

      if (name === 'Login' && response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        navigate('/');
      } else if (name === 'Sign Up') {
        alert('Signup successful! Please log in.');
        setName('Login');
      }
    } catch (error) {
      console.error('Error sending data to the backend:', error);
      alert(error.response?.data?.error || 'An error occurred. Please try again.');
    }
  }

  return (
    <div className='body'>
      <div className='signupcontainer' ref={id}>
        <h2>{name}</h2>
        <form onSubmit={handleSubmit}>
          <div className='inputcontainer'>
            {name === 'Sign Up' && (
              <input type='text' placeholder='Name' name='name' onChange={handle} required />
            )}
            <input type='email' name='email' placeholder='Email' onChange={handle} required />
            <input type='password' name='password' placeholder='Password' onChange={handle} required />
          </div>
          <div className='buttoncontainerr'>
            <button type='submit' className='n' >Submit</button>
          </div>
        </form>
      </div>
      <div className='cont'>
        <h5>REJOINS BLANCORACLUB. REÇOIS DES RÉCOMPENSES DÈS AUJOURD'HUI.</h5>
        <p>En tant que membre de BLANCORACLUB, tu es récompensé(e) pour vivre pleinement tes passions. Inscris-toi aujourd'hui et accède immédiatement à ces avantages :</p>
        <ul>
          <li>Un code promo de -10 % pour ton prochain achat</li>
          <li>Accès immédiat à tous les avantages du programme de fidélité</li>
          <li>Collections et produits en édition limitée</li>
          <li>Offres spéciales et promotions</li>
        </ul>
        <p>Rejoins-nous et reçois des récompenses.
        C'est le moment de découvrir le meilleur d'adidas.</p>
        <div className='bt'>
        <button type='button' className='n' onClick={handleSignUp}>Sign Up</button>
        <button type='button' className='n' onClick={handleLogin}>Login</button>
        </div>  
        </div>
    </div>
  );
}

export default SignUp;
