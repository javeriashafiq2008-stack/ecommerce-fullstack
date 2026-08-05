import api from "../api/axios";

// All vendor-related API calls live here so components
// don't talk to axios directly.

export const getVendorProducts = () => api.get("/api/vendor/all");

export const addVendorProduct = (data) => api.post("/api/vendor/add", data);

export const updateVendorProduct = (id, data) =>
  api.put(`/api/vendor/update/${id}`, data);

export const deleteVendorProduct = (id) =>
  api.delete(`/api/vendor/delete/${id}`);

