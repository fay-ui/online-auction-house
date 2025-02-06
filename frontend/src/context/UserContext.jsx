import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the UserContext
export const UserContext = createContext();

// UserProvider component to wrap your app and provide context value
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken') || null); // Retrieve token from localStorage
  const [errorMessage, setErrorMessage] = useState(""); // Store error message
  const [successMessage, setSuccessMessage] = useState(""); // Store success message

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    // Check if user data exists and is valid JSON
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // If valid JSON, set the user as the current user
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
        localStorage.removeItem('user'); // Remove corrupted data
        setUser(null); // Clear the user state
      }
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password });
      const { access_token, user } = response.data;

      // Save the user data and token in localStorage
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update the context state
      setAuthToken(access_token);
      setUser(user);
      setErrorMessage('');
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

  // Fetch current user data
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/current_user', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Update the user state with the fetched data
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to load user data');
    }
  };

  // Update user information
  const updateUser = async (updatedData) => {
    try {
      const response = await axios.put('http://localhost:5000/update_user', updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Update the user data and store in localStorage
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setSuccessMessage('Profile updated successfully!');
      setErrorMessage('');
    } catch (error) {
      console.error('Failed to update user data:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        authToken,
        login,
        logout,
        addUser,
        errorMessage,
        successMessage,
        fetchCurrentUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
