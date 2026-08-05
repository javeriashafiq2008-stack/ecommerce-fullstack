

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  addProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
} from "../services/vendorService.js";

// ── 1. FETCH ALL VENDOR PRODUCTS ─────────────────────────────────────────────

export const fetchVendorProducts = createAsyncThunk(
  "vendor/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getVendorProducts();
      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// ── 2. CREATE A PRODUCT ───────────────────────────────────────────────────────

export const createVendorProduct = createAsyncThunk(
  "vendor/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await addProduct(formData);
      return res.data; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// ── 3. UPDATE A PRODUCT ───────────────────────────────────────────────────────

export const updateVendorProduct = createAsyncThunk(
  "vendor/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await updateProduct(id, formData);
      return res.data; // expects the updated product object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// ── 4. DELETE A PRODUCT ───────────────────────────────────────────────────────

export const deleteVendorProduct = createAsyncThunk(
  "vendor/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id; 
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// ── SLICE ─────────────────────────────────────────────────────────────────────
const vendorSlice = createSlice({
  name: "vendor",
  initialState: {
    products: [],   
    loading: false, 
    error: null,    
    success: false, },

  // Synchronous actions — use these to clear error/success banners from UI
  reducers: {
    clearVendorStatus(state) {
      state.error   = null;
      state.success = false;
    },
  },

  // Async thunk cases 
  extraReducers: (builder) => {
    builder

      // ── FETCH ──────────────────────────────────────────────────────────────
      .addCase(fetchVendorProducts.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchVendorProducts.fulfilled, (state, action) => {
        state.loading  = false;
       
        state.products = Array.isArray(action.payload)
          ? action.payload
          : action.payload.products ?? [];
      })
      .addCase(fetchVendorProducts.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── CREATE ─────────────────────────────────────────────────────────────
      .addCase(createVendorProduct.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.success = false;
      })
      .addCase(createVendorProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        const newProduct = action.payload.product ?? action.payload;
        state.products.unshift(newProduct); 
      })
      .addCase(createVendorProduct.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── UPDATE ─────────────────────────────────────────────────────────────
      .addCase(updateVendorProduct.pending, (state) => {
        state.loading = true;
        state.error   = null;
        state.success = false;
      })
      .addCase(updateVendorProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        
        const updated = action.payload.product ?? action.payload;
        const idx = state.products.findIndex((p) => p.id === updated.id);
        if (idx !== -1) state.products[idx] = updated;
      })
      .addCase(updateVendorProduct.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      })

      // ── DELETE ─────────────────────────────────────────────────────────────
      .addCase(deleteVendorProduct.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(deleteVendorProduct.fulfilled, (state, action) => {
        state.loading  = false;
        state.success  = true;
       
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteVendorProduct.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload;
      });
  },
});

export const { clearVendorStatus } = vendorSlice.actions;
export default vendorSlice.reducer;