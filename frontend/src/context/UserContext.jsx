import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the UserContext
export const UserContext = createContext();

// UserProvider component to wrap your app and provide context value
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null); // Retrieve token from localStorage
  const [errorMessage, setErrorMessage] = useState(""); // Store error message

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // If there's a stored user, set it as the current user
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      const { access_token, user } = response.data;

      // Save the user data and token in localStorage
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update the context state
      setAuthToken(access_token);
      setUser(user);
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  // Register function
  const addUser = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, email, password });
      const { access_token, user } = response.data;

      // Save the user data and token in localStorage
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update the context state
      setAuthToken(access_token);
      setUser(user);
      setErrorMessage(''); // Clear error message on success
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // Logout function
  const logout = () => {
    // Clear data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Clear context state
    setAuthToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, authToken, login, logout, addUser, errorMessage }}>
      {children}
    </UserContext.Provider>
  );
};
