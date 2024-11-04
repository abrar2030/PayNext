import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';

const Profile = () => {
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await UserService.getUserProfile();
        setUser(data);
      } catch (err) {
        setErrorMessage('Failed to load user profile.');
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await UserService.updateUserProfile(user);
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setErrorMessage('Failed to update profile. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Profile</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={user.name || ''}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={user.email || ''}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
