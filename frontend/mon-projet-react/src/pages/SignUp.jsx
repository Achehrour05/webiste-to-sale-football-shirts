
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 


const SignUpPage = () => {
 
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); 
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    setMessage(''); 
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setMessage("Veuillez accepter les Termes et Conditions ainsi que la Politique de Confidentialité.");
      setMessageType('error');
      return;
    }
    if (registerData.password.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères.");
      setMessageType('error');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('http://localhost:3000/register', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData), 
      });

      const data = await response.json(); 

      if (response.ok) {
        setMessage(data.message || 'Inscription réussie ! Vous pouvez maintenant vous connecter.');
        setMessageType('success');
        setRegisterData({ name: '', email: '', password: '' }); 
        setAgreedToTerms(false); 
        console.log("SignUpPage: Inscription réussie. Réponse du serveur:", data);
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      } else {
        setMessage(data.error || 'Une erreur est survenue lors de l’inscription.');
        setMessageType('error');
        console.error("SignUpPage: Erreur d'inscription API. Status:", response.status, "Data:", data);
      }
    } catch (error) {
      setMessage('Une erreur de connexion est survenue. Veuillez réessayer.');
      setMessageType('error');
      console.error("SignUpPage: Erreur réseau ou autre lors de l'inscription:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={`min-h-screen  flex font-jost`}> 
      <div 
        className="hidden md:block md:w-[50%] min-h-screen bg-cover bg-center relative" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('http://localhost:3000/assets/messii.jpg')`

        }}
      >
      </div>
      
      <div className={`ww-full md:w-[50%] px-8 py-12 md:px-14 relative overflow-y-auto`}>
        <div className="max-w-md w-full">
          <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-[0.4em] sm:tracking-[0.5rem] mt-8 mb-3 text-gray-900 dark:text-white text-center md:text-left">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mb-8 leading-relaxed text-center md:text-left">
            Join our football community and get access to exclusive gear, tips, and deals. 
            Free forever. No payment required.
          </p>

          {message && (
            <div className={`w-full my-4 text-xs uppercase tracking-wider p-3 rounded-md text-center ${
              messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="w-full mt-8 pt-4 space-y-5">
            <div>
              <label htmlFor="name-register" className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Full Name
              </label>
              <input
                id="name-register"
                name="name"
                type="text"
                required
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Your Full Name"
                className="w-full h-11 text-gray-900 dark:text-white font-medium bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 py-2 px-1 outline-none focus:border-gray-700 dark:focus:border-gray-300 transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="email-register" className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Email Address
              </label>
              <input
                id="email-register"
                name="email"
                type="email"
                required
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="Your Email Address"
                className="w-full h-11 text-gray-900 dark:text-white font-medium bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 py-2 px-1 outline-none focus:border-gray-700 dark:focus:border-gray-300 transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="password-register" className="block text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                Password
              </label>
              <input
                id="password-register"
                name="password"
                type="password"
                required
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="6+ Characters"
                className="w-full h-11 text-gray-900 dark:text-white font-medium bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 py-2 px-1 outline-none focus:border-gray-700 dark:focus:border-gray-300 transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-sm"
              />
            </div>

            <div className="flex items-start mt-6 mb-5"> 
              <input
                id="terms-and-privacy"
                name="terms-and-privacy"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 mr-2.5 cursor-pointer accent-gray-700 dark:accent-gray-400 flex-shrink-0" // accent pour la couleur de la coche
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                By creating an account, you agree to our{' '}
                <Link
                  to="/terms"
                  className="text-gray-700 dark:text-gray-300 underline font-medium cursor-pointer hover:opacity-70" 
                >
                  Terms and Conditions
                </Link>{' '}
                and our{' '}
                <Link 
                  to="/privacy"
                  className="text-gray-700 dark:text-gray-300 underline font-medium cursor-pointer hover:opacity-70" 
                >
                  Privacy Policy
                </Link>.
              </div>
            </div>

            <button 
              type="submit" 
              className="uppercase font-semibold bg-gray-800 dark:bg-gray-700 text-white w-full sm:w-48 h-12 rounded-md mt-6 outline-none cursor-pointer tracking-wider transition-all hover:bg-gray-700 dark:hover:bg-gray-600 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:shadow-md focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-10 text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-gray-700 dark:text-gray-300 underline font-medium cursor-pointer hover:opacity-70" 
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;