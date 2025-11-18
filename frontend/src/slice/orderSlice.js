import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ORDER_API_END_POINT } from "../utils/constant";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${ORDER_API_END_POINT}/create`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
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

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    myOrders: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // --------------- PLCAE ORDER -----------------
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;

        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
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
      });
  },
});

export const { resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;
