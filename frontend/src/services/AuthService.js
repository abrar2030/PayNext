import axios from 'axios';

const API_URL = 'https://api.yourdomain.com/auth/';

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}login`, { email, password });
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

const register = async (email, password) => {
  const response = await axios.post(`${API_URL}register`, { email, password });
  localStorage.setItem('user', JSON.stringify(response.data));
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default AuthService;
