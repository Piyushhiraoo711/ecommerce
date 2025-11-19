import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { USER_API_END_POINT } from "../utils/constant.js";
import axios from "axios";

// --------------------- USER LOAD ----------------------
export const fetchUser = createAsyncThunk("auth/fetchUser", async () => {
  const res = await axios.get("/api/auth/me", { withCredentials: true });
  return res.data;
});

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

//--------------------- LOGOUT USER -------------------
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

// -------------------- UPDATE USER --------------------
export const updatedUser = createAsyncThunk(
  "auth/updatedUser",
  async ({ userId, updatedData }, { rejectWithValue }) => {
    try {
      console.log(userId, updatedData)
      const response = await axios.put(
        `${USER_API_END_POINT}/${userId}`,
        updatedData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
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
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---------------- LOAD USER ----------------
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
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
      })

      // --------------- UPDATE --------------
      .addCase(updatedUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatedUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updatedUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --------------- LOGOUT -----------------
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
