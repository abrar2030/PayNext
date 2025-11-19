import AuthService from '../AuthService';
import api from '../api'; // Assuming api.js handles actual HTTP requests

// Mock the api module
jest.mock('../api');

describe('AuthService', () => {
  afterEach(() => {
    // Clear mock calls after each test
    jest.clearAllMocks();
    // Clear potential localStorage changes if logout is tested
    // localStorage.clear();
  });

  // --- Login Tests ---
  it('should call the login API endpoint with correct credentials', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockResponse = { success: true, token: 'fake-token', user: { id: 1, email } };

    // Configure the mock for the 'post' method of the api module
    api.post.mockResolvedValue(mockResponse);

    await AuthService.login(email, password);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email, password });
  });

  it('should return user data and token on successful login', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const mockResponse = { success: true, token: 'fake-token', user: { id: 1, email } };
    api.post.mockResolvedValue(mockResponse);

    const result = await AuthService.login(email, password);

    expect(result).toEqual(mockResponse);
    // Optionally check if token is stored (if applicable)
    // expect(localStorage.getItem('token')).toBe('fake-token');
  });

  it('should throw an error on login API failure', async () => {
    const email = 'test@example.com';
    const password = 'password123';
    const errorMessage = 'Invalid credentials';
    api.post.mockRejectedValue(new Error(errorMessage));

    await expect(AuthService.login(email, password)).rejects.toThrow(errorMessage);
  });

  // --- Register Tests ---
  it('should call the register API endpoint with correct user data', async () => {
    const userData = { username: 'testuser', email: 'new@example.com', password: 'password123' };
    const mockResponse = { success: true, message: 'User registered successfully' }; // Adjust based on actual API response
    api.post.mockResolvedValue(mockResponse);

    await AuthService.register(userData.username, userData.email, userData.password);

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/auth/register', userData);
  });

  it('should return success message on successful registration', async () => {
    const userData = { username: 'testuser', email: 'new@example.com', password: 'password123' };
    const mockResponse = { success: true, message: 'User registered successfully' };
    api.post.mockResolvedValue(mockResponse);

    const result = await AuthService.register(userData.username, userData.email, userData.password);

    expect(result).toEqual(mockResponse);
  });

  it('should throw an error on register API failure', async () => {
    const userData = { username: 'testuser', email: 'new@example.com', password: 'password123' };
    const errorMessage = 'Email already exists';
    api.post.mockRejectedValue(new Error(errorMessage));

    await expect(AuthService.register(userData.username, userData.email, userData.password)).rejects.toThrow(errorMessage);
  });

  // --- Logout Test (Example if it exists and uses localStorage) ---
  /*
  it('should clear authentication token on logout', () => {
    localStorage.setItem('token', 'fake-token'); // Set up initial state
    AuthService.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });
  */
});
