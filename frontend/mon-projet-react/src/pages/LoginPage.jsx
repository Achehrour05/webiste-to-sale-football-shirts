
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; 

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth(); 
  const navigate = useNavigate(); 


  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('http://localhost:3000/login', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData), 
      });

      const dataFromApi = await response.json(); 

      if (response.ok) {
        console.log("LoginPage: Login API success. Data:", dataFromApi);
        if (dataFromApi.user) {
          login(dataFromApi.user); 
          setLoginData({ email: '', password: '' });
          console.log("LoginPage: Navigating to / (home page)");
          navigate('/');
        } else {
          console.error("LoginPage: Login API success but no user object in response", dataFromApi);
          setMessage('Erreur: Réponse du serveur invalide.');
          setMessageType('error');
        }
      } else {
        console.error("LoginPage: Login API error. Status:", response.status, "Data:", dataFromApi);
        setMessage(dataFromApi.error || 'Email ou mot de passe incorrect.');
        setMessageType('error');
      }


    } catch (error) {
      console.error("LoginPage: Network or other error during login submit:", error);
      setMessage('Une erreur de réseau est survenue. Veuillez réessayer.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen  flex font-jost`}>
      <div 
        className="hidden md:block md:w-[50%] min-h-screen bg-cover bg-center relative" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('http://localhost:3000/assets/neymarr.jpg')`
        }}
      >
      </div>

      <div className={`ww-full md:w-[50%] px-8 py-12 md:px-14 relative overflow-y-auto`}>
        <div className="max-w-md w-full"> 
          <h1 className="text-4xl lg:text-5xl font-light uppercase tracking-[0.5rem] mb-2 text-gray-900 dark:text-white text-center md:text-left">
            Welcome Back
          </h1>
          <p className="text-sm tracking-wider max-w-md mb-8 leading-relaxed text-gray-500 dark:text-gray-400 text-center md:text-left">
            Sign in to access your football gear collection and exclusive deals. Ready to gear up for your next game?
          </p>

          {message && (
            <div className={`w-full mb-4 text-xs uppercase tracking-wider p-3 rounded-md text-center ${
              messageType === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="w-full mt-8 pt-4 space-y-6">
            <div>
              <label 
                htmlFor="email-login" 
                className="block text-xs uppercase tracking-wider mb-2 text-gray-500 dark:text-gray-400"
              >
                Email Address
              </label>
              <input
                id="email-login"
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="Your Email Address"
                className="w-full h-12 bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 pb-2 outline-none font-medium text-base focus:border-gray-700 dark:focus:border-gray-300 transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label 
                htmlFor="password-login" 
                className="block text-xs uppercase tracking-wider mb-2 mt-4 text-gray-500 dark:text-gray-400"
              >
                Password
              </label>
              <input
                id="password-login"
                name="password"
                type="password"
                required
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="Your Password"
                className="w-full h-12 bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 pb-2 outline-none font-medium text-base focus:border-gray-700 dark:focus:border-gray-300 transition-colors text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>

            <div className="flex justify-end mb-2 mt-2">
              <Link
                to="/forget-pass" 
                className="text-xs underline font-medium hover:opacity-70 transition-opacity text-gray-600 dark:text-gray-400"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit" 
              disabled={isLoading}
              className="uppercase font-light w-full sm:w-48 h-12 rounded-md outline-none cursor-pointer tracking-wider mt-6 transition-all hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 dark:bg-gray-700 text-white text-sm hover:shadow-lg focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center md:text-left">
            <p className="text-sm tracking-wider text-gray-500 dark:text-gray-400">
              New here?{' '}
              <Link
                to="/registration"
                className="underline font-medium hover:opacity-70 transition-opacity text-gray-700 dark:text-gray-300"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;