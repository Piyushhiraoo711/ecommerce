import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ORDER_API_END_POINT } from "../utils/constant";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ items, paymentMethod }, { rejectWithValue }) => {
    try {
      const products = items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      const { data } = await axios.post(
        `${ORDER_API_END_POINT}/create`,
        { products, paymentMethod },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const myOrder = createAsyncThunk(
  "order/myOrder",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${ORDER_API_END_POINT}/my-orders`, {
        withCredentials: true,
      });
      return res.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${ORDER_API_END_POINT}/cancel-order/${orderId}`, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    myOrders: null,
    success: false,
    loading: false,
    error: null,
  },
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // --------------- PLCAE ORDER -----------------
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ------------------ USER ORDERS ----------------
      .addCase(myOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(myOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(myOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ----------------- CANCEL ORDER ----------------
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedOrder = action.payload.order;
        state.myOrders = state.myOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
