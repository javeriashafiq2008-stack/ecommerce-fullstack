import axios from "axios";
import { isDemoModeActive, handleMockRequest } from "./mockApi.js";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

const defaultAdapter = axios.getAdapter(axios.defaults.adapter);

api.defaults.adapter = async (config) => {
  if (isDemoModeActive()) {
    return handleMockRequest(config);
  }
  return defaultAdapter(config);
};

export default api;