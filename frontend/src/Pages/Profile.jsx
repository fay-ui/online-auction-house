import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { current_user, logout, updateUser, fetchCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch user data when component mounts
  useEffect(() => {
    if (!current_user) {
      // Redirect to login if not logged in
      navigate('/login');
    } else {
      // Simulate async fetching of user data (could be an API call)
      setUsername(current_user.username);
      setEmail(current_user.email);
      setLoading(false);
    }
  }, [current_user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!username || !email) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      await updateUser({ username, email }); // Assuming `updateUser` is a function in your context to update the user info
      setEditMode(false);
      setError('');
    } catch (err) {
      setError('Failed to update profile. Please try again later.');
    }
  };

  if (loading) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <>
      {!current_user ? (
        <p className="text-center text-red-600 font-semibold">Not authorized</p>
      ) : (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Profile</h2>

          {/* Error Message */}
          {error && <p className="text-red-600">{error}</p>}

          <div className="space-y-4">
            {/* Username */}
            <div className="flex justify-between">
              <h3 className="text-xl font-medium text-gray-600">Username</h3>
              {editMode ? (
                <input
                  type="text"
                  className="text-gray-800 border border-gray-300 p-2 rounded-md"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              ) : (
                <p className="text-gray-800">{username}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex justify-between">
              <h3 className="text-xl font-medium text-gray-600">Email</h3>
              {editMode ? (
                <input
                  type="email"
                  className="text-gray-800 border border-gray-300 p-2 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <p className="text-gray-800">{email}</p>
              )}
            </div>

            {/* Approval Status */}
            <div className="flex justify-between">
              <h3 className="text-xl font-medium text-gray-600">Approval Status</h3>
              <p
                className={`text-sm font-semibold ${
                  current_user?.is_approved ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {current_user?.is_approved ? 'Approved' : 'Pending Approval'}
              </p>
            </div>

            {/* Admin Status */}
            <div className="flex justify-between">
              <h3 className="text-xl font-medium text-gray-600">Admin Status</h3>
              <p
                className={`text-sm font-semibold ${
                  current_user?.is_admin ? 'text-blue-900' : 'text-orange-600'
                }`}
              >
                {current_user?.is_admin ? 'Admin' : 'User'}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            {/* Update Profile Button */}
            {editMode ? (
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Update Profile
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={logout} // Triggers the logout function from context
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
