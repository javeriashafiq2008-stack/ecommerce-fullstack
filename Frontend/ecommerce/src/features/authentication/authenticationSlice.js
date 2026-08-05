import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js"; 

// ---- Async Thunks ----

// Register a new user. 

export const userRegister = createAsyncThunk(
  "auth/userRegister",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/auth/register", userData);
      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Log in. 
export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      await api.post("/api/auth/login", credentials);
      const me = await dispatch(checkAuthStatus()).unwrap();
      return me;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Invalid email or password"
      );
    }
  }
);


export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/auth/me");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Not authenticated"
      );
    }
  }
);


export const userLogout = createAsyncThunk(
  "auth/userLogout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/api/auth/logout");
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// ---- Slice ----

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle", 
  authChecked: false,
  error: null,
};

const authenticationSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(userRegister.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(userLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Check auth status (app bootstrap)
      .addCase(checkAuthStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.status = "idle";
        state.user = null;
        state.isAuthenticated = false;
        state.authChecked = true; 
      })

      // Logout
      .addCase(userLogout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
      });
  },
});

export const { clearAuthError } = authenticationSlice.actions;
export default authenticationSlice.reducer;