
import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "../features/authentication/authenticationSlice.js";
import vendorReducer          from "../features/vendorSlice.js";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer, 
    vendor: vendorReducer,          
  },
});

export default store;