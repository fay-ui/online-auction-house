import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate(); // For redirecting after successful login

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error state

  // ====> To Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if both fields are filled
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    setIsLoading(true); // Start loading
    setError(''); // Reset any previous error

    try {
      const response = await login(email, password); // login returns a promise
      if (response?.access_token) { // Correctly check for access_token
        // Store JWT token in localStorage or sessionStorage
        localStorage.setItem('token', response.access_token);
        navigate('/profile'); // Redirect to the profile page after login

        // Clear the input fields after successful login
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError('Invalid email or password'); // Handle error
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="w-[40%] bg-white p-4 rounded-xl h-min"
      >
        <h3 className="text-2xl my-4 font-bold font-mono">Login</h3>

        {/* Email Input */}
        <div className="relative mb-6">
          <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
            Email
            <svg
              width="7"
              height="7"
              className="ml-1"
              viewBox="0 0 7 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                fill="#EF4444"
              />
            </svg>
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
            placeholder="Enter Email"
            required
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-6">
          <label className="flex items-center mb-2 text-gray-600 text-sm font-medium">
            Password
            <svg
              width="7"
              height="7"
              className="ml-1"
              viewBox="0 0 7 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                fill="#EF4444"
              />
            </svg>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full h-11 px-5 py-2.5 bg-white leading-7 text-base font-normal shadow-xs text-gray-900 bg-transparent border border-gray-300 rounded-full placeholder-gray-400 focus:outline-none"
            placeholder="Password"
            required
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-600 text-sm font-semibold mb-4">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full h-12 ${isLoading ? 'bg-gray-400' : 'bg-orange-600'} hover:bg-orange-800 transition-all duration-700 rounded-full shadow-xs text-white text-base font-semibold leading-6 mb-6`}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        {/* Register Link */}
        <div>
          Not yet registered?{' '}
          <Link to="/register" className="text-orange-500">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}
