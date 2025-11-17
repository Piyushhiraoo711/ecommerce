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

const sellerSlice = createSlice({
  name: "seller",
  initialState: {
    orders: [],
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
      });
  },
});

export default sellerSlice.reducer;
