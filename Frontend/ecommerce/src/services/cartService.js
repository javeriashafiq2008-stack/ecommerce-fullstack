import api from "../api/axios.js";

// Add Product to Cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/api/cart/addtocart", {
    productId,
    quantity,
  });

  return response.data;
};

// Get Logged-in User's Cart
export const getCart = async () => {
  const response = await api.get("/api/cart");
  return response.data;
};


export const updateCartItem = async (cartItemId, quantity) => {
  const response = await api.patch("/api/cart/update", {
    cartItemId,
    quantity,
  });

  return response.data;
};


// Remove Item from Cart
export const removeFromCart = async (cartItemId) => {
  const response = await api.delete(`/api/cart/remove/${cartItemId}`);
  return response.data;
};