import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // For navigation after logout
import { UserContext } from '../context/UserContext';  // Import context for logout

const LogoutPage = () => {
  const { logout } = useContext(UserContext);  // Get the logout function from context
  const navigate = useNavigate();  // Hook to navigate after logout

  useEffect(() => {
    // Call the logout function from context
    logout();

    // After logout, navigate to the login page (or home page)
    navigate('/login');  // Redirect to login page after logging out
  }, [logout, navigate]);

  return (
    <div className="text-center p-6">
      <p>Logging out...</p>
    </div>
  );
};

export default LogoutPage;
