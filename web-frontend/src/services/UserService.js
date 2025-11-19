import axios from 'axios';

// Use environment variable or default to localhost API gateway
const API_URL = process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8002/users/';

const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}profile`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user')}`,
    },
  });
  return response.data;
};

const updateUserProfile = async (userData) => {
  const response = await axios.put(`${API_URL}profile`, userData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('user')}`,
    },
  });
  return response.data;
};

const UserService = {
  getUserProfile,
  updateUserProfile,
};

export default UserService;
