import API from "../api/axios.js";

// Add Product
export const addProduct = (formData) =>
  API.post("/api/vendor/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Get Vendor Products
export const getVendorProducts = () =>
  API.get("/api/vendor/all");

// Update Product
export const updateProduct = (id, formData) =>
  API.put(`/api/vendor/update/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete Product
export const deleteProduct = (id) =>
  API.delete(`/api/vendor/delete/${id}`);