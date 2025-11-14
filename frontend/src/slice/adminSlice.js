// adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ADMIN_API_END_POINT } from "../utils/constant";

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
      return data.data;
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
      return data.data;
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
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const totalUser = createAsyncThunk(
  "admin/totalUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/top-user`, {
        withCredentials: true,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const totalSeller = createAsyncThunk(
  "admin/totalSeller",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/total-seller`, {
        withCredentials: true,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const topproduct = createAsyncThunk(
  "admin/topProduct",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ADMIN_API_END_POINT}/top-product`, {
        withCredentials: true,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard"
      );
    }
  }
);

export const totalOrderByStatus = createAsyncThunk(
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
    topSellers: [],
    topUsers: [],
    totalUser: 0,
    totalSeller: 0,
    topproduct: [],
    totalOrderByStatus: {},
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
        state.dashboard = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


  },
});

export default adminSlice.reducer;
