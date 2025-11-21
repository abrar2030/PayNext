import axios from "axios";

// Use environment variable or default to localhost API gateway
const API_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8002/auth/";

const login = async (email, password) => {
  const response = await axios.post(`${API_URL}login`, { email, password });
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

const register = async (email, password) => {
  const response = await axios.post(`${API_URL}register`, { email, password });
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default AuthService;
