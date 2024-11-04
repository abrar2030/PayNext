import axios from 'axios';

const API_URL = 'https://api.yourdomain.com/users/';

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
