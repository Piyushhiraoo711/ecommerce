// adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMIN_API_END_POINT, PRODUCT_API_END_POINT } from "../utils/constant";

// fetch admin dashboard data
export const fetchAdminDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${ADMIN_API_END_POINT}/get-admin-dashboard`,
        {
          withCredentials: true,
        }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const totalUsers = createAsyncThunk(
  "admin/totalUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/total-user`, {
        withCredentials: true,
      });
      console.log(data);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const totalSellers = createAsyncThunk(
  "admin/totalSellers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/total-seller`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const allProducts = createAsyncThunk(
  "admin/allProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${PRODUCT_API_END_POINT}`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const topUsers = createAsyncThunk(
  "admin/topUsers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/top-users`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const topSellers = createAsyncThunk(
  "admin/topSellers",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/top-sellers`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const topProducts = createAsyncThunk(
  "admin/topProduct",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/top-product`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const totalOrderStatus = createAsyncThunk(
  "admin/totalOrderByStatus",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${ADMIN_API_END_POINT}/total-order-by-status`,
        {
          withCredentials: true,
        }
      );
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    dashboard: null,
    loading: false,
    error: null,
    totalUser: null,
    totalSeller: null,
    allProduct: null,
    topUser: null,
    topSeller: null,
    topProduct: null,
    totalOrderByStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload.data;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(totalUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(totalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUser = action.payload;
      })
      .addCase(totalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(totalSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(totalSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.totalSeller = action.payload;
      })
      .addCase(totalSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(allProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.allProduct = action.payload;
      })
      .addCase(allProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(topUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.topUser = action.payload;
      })
      .addCase(topUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(topSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.topSeller = action.payload;
      })
      .addCase(topSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(topProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProduct = action.payload;
      })
      .addCase(topProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(totalOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(totalOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.totalOrderByStatus = action.payload;
      })
      .addCase(totalOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default adminSlice.reducer;
