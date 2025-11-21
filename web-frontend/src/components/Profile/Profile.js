import React, { useState, useEffect } from "react";
import UserService from "../../services/UserService";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await UserService.getUserProfile();
        setUser(data);
      } catch (err) {
        setErrorMessage("Failed to load user profile.");
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await UserService.updateUserProfile(user);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">Your Profile</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="profile-form" onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={user.email || ""}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="submit-button">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
