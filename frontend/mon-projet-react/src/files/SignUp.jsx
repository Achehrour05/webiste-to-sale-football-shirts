import './Signupcss.css';
import React, { useState, useRef } from 'react';
import Images from './Images';
import { useNavigate } from 'react-router-dom';

function SignUp() {
    let [name, setName] = useState('Sign Up');
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

        const data = {
            name: change.name,
            email: change.email,
            password: change.password
        };

        try {
            const endpoint = name === 'Sign Up'
                ? 'http://localhost:5000/registration/signup'
                : 'http://localhost:5000/registration/login';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch, server may be down or CORS issue');
            }

            const responseData = await response.json();
            console.log('Response from backend:', responseData);

            if (name === 'Login' && responseData.accessToken) {
                localStorage.setItem('token', responseData.accessToken);
                navigate(`/`, {
                    state: { user_name: responseData.user_name }
                });
            } else if (name === 'Sign Up') {
                alert('Signup successful! Please log in.');
                setName('Login');
            }
        } catch (error) {
            console.error('Error in fetch:', error);
            alert(error.message || 'An error occurred. Please try again.');
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
                        <button type='submit' className='n'>Submit</button>
                    </div>
                </form>
            </div>
            <div className='cont'>
                <Images />
                <div className='bt'>
                    <button type='button' className='n' onClick={handleSignUp}>Sign Up</button>
                    <button type='button' className='n' onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
