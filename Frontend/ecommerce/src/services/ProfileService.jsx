import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

export const updateProfile = async (updates) => {
  const response = await api.put("/api/auth/update-profile", updates);
  return response.data;
};

/**
 * Upload a profile image.
 * FormData must contain:
 * formData.append("avatar", file)
 */
export const uploadAvatar = async (formData) => {
  const response = await api.put(
    "/api/auth/update-profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    }
  );

  return response.data;
};