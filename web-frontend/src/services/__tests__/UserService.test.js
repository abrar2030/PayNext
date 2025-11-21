import UserService from "../UserService";
import api from "../api"; // Assuming api.js handles actual HTTP requests

// Mock the api module
jest.mock("../api");

describe("UserService", () => {
  afterEach(() => {
    // Clear mock calls after each test
    jest.clearAllMocks();
  });

  // --- getUserProfile Tests ---
  it("should call the get user profile API endpoint", async () => {
    const mockResponse = {
      success: true,
      user: { id: 1, username: "testuser" },
    };
    api.get.mockResolvedValue(mockResponse);

    await UserService.getUserProfile();

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(api.get).toHaveBeenCalledWith("/users/profile");
  });

  it("should return user profile data on successful fetch", async () => {
    const mockUser = { id: 1, username: "testuser", email: "test@example.com" };
    const mockResponse = { success: true, user: mockUser };
    api.get.mockResolvedValue(mockResponse);

    const result = await UserService.getUserProfile();

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error on get user profile API failure", async () => {
    const errorMessage = "Failed to fetch profile";
    api.get.mockRejectedValue(new Error(errorMessage));

    await expect(UserService.getUserProfile()).rejects.toThrow(errorMessage);
  });

  // --- updateUserProfile Tests ---
  it("should call the update user profile API endpoint with correct data", async () => {
    const profileData = {
      username: "updateduser",
      email: "updated@example.com",
    };
    const mockResponse = { success: true, user: { id: 1, ...profileData } };
    api.put.mockResolvedValue(mockResponse); // Assuming PUT request for update

    await UserService.updateUserProfile(profileData);

    expect(api.put).toHaveBeenCalledTimes(1);
    expect(api.put).toHaveBeenCalledWith("/users/profile", profileData);
  });

  it("should return updated user profile data on successful update", async () => {
    const profileData = { username: "updateduser" };
    const mockResponse = {
      success: true,
      user: { id: 1, email: "test@example.com", ...profileData },
    };
    api.put.mockResolvedValue(mockResponse);

    const result = await UserService.updateUserProfile(profileData);

    expect(result).toEqual(mockResponse);
  });

  it("should throw an error on update user profile API failure", async () => {
    const profileData = { username: "updateduser" };
    const errorMessage = "Failed to update profile";
    api.put.mockRejectedValue(new Error(errorMessage));

    await expect(UserService.updateUserProfile(profileData)).rejects.toThrow(
      errorMessage,
    );
  });
});
