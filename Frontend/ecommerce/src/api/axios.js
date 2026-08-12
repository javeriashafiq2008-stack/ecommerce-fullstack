import axios from "axios";

const api = axios.create({
  baseURL: "https://ecommerce-backend-javeria3.vercel.app", 
 withCredentials:true,
});

export default api;