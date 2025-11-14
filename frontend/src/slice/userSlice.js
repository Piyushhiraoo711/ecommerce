import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { USER_API_END_POINT } from "../utils/constant.js";
import axios from "axios";

export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${USER_API_END_POINT}/me`, {
        withCredentials: true,
      });
      return data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Load user failed");
    }
  }
);

// -------------------- REGISTER USER --------------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${USER_API_END_POINT}/register`,
        userData,
        { withCredentials: true }
      );
      console.log("Register User Data:", data);
      localStorage.setItem("user", userData);
      return userData;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Signup failed");
    }
  }
);

// -------------------- OTP VERIFY --------------------
export const otpVerify = createAsyncThunk(
  "auth/otpVerify",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${USER_API_END_POINT}/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

// -------------------- LOGIN USER --------------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${USER_API_END_POINT}/login`,
        credentials,
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    otpPending: false,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- LOAD USER ----------------
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // ---------------- REGISTER ----------------
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.otpPending = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- OTP VERIFY ----------------
      .addCase(otpVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(otpVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.otpPending = false;
      })
      .addCase(otpVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ---------------- LOGIN ----------------
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
