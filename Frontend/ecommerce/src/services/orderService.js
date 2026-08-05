import api from "../api/axios.js";
 const checkout = async (data) => {
  const response = await api.post("/api/checkout", data);
  return response.data;
};

export default checkout;