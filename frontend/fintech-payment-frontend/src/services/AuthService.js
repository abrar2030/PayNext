import axios from 'axios';

const API_URL = 'http://localhost:8080/users/';

class AuthService {
  login(username, password) {
    return axios.post(API_URL + 'login', {
      username,
      password
    }).then(response => {
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
      }
    });
  }

  logout() {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  }

  register(username, email, password) {
    return axios.post(API_URL + 'register', {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
