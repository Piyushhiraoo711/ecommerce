import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ORDER_API_END_POINT } from "../utils/constant";
import axios from "axios";

export const fetchSellerOrders = createAsyncThunk(
  "orders/fetchSellerOrders",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${ORDER_API_END_POINT}/user-orders`, {
        withCredentials: true,
      });

      return response.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller orders"
      );
    }
  }
);

export const fetchSellerStats = createAsyncThunk(
  "seller/fetchSellerStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${ORDER_API_END_POINT}/stats`, {
        withCredentials: true,
      });
      return data.stats || {
        totalProducts: 0,
        totalStock: 0,
        totalOrders: 0,
        totalCustomers: 0,
        statusCounts: {
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        },
        totalSoldItems: 0,
        totalRevenue: 0,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch seller stats");
    }
  }
);

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    orders: [],
    stats : null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSellerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchSellerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.stats = {
          totalProducts: 0,
          totalStock: 0,
          totalOrders: 0,
          totalCustomers: 0,
          statusCounts: {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
          },
          totalSoldItems: 0,
          totalRevenue: 0,
        };
      });
  },
});

export default sellerSlice.reducer;
