import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/userSlice.js";
import productReducer from "../slice/productSlice.js";
import adminReducer from "../slice/adminSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product : productReducer,
    admin: adminReducer,
  },
});
