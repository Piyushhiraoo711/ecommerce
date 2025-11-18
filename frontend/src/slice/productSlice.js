import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  PRODUCT_API_END_POINT,
  CART_API_END_POINT,
} from "../utils/constant.js";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(PRODUCT_API_END_POINT);
      return res.data.product;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${PRODUCT_API_END_POINT}/${id}`);
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  "product/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${PRODUCT_API_END_POINT}/seller-products`, {
        withCredentials: true,
      });
      return res.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${PRODUCT_API_END_POINT}/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      console.log("Response from createProduct:", res);
      return res.data;
    } catch (error) {
      console.log("Error in createProduct:", error.response.data);
      return rejectWithValue(
        error.response?.data || "Failed to create product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${PRODUCT_API_END_POINT}/${id}`,
        productData,
        { withCredentials: true }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${PRODUCT_API_END_POINT}/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      console.log("Sending to API:", { productId, quantity });

      const { data } = await axios.post(
        `${CART_API_END_POINT}/add`,
        { productId, quantity },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Response from API:", data);
      return data;
    } catch (err) {
      console.error("Add to cart error:", err.response || err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const getMyCart = createAsyncThunk(
  "product/getMyCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(CART_API_END_POINT, {
        withCredentials: true,
      });
      return data.cart;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${CART_API_END_POINT}/remove/${itemId}`,
        {
          withCredentials: true,
        }
      );
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(`${CART_API_END_POINT}/clear`, {
        withCredentials: true,
      });
      return data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    product: null,
    sellerProduct: [],
    cart: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerProduct = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.products[index] = action.payload;

        const sellerIndex = state.sellerProduct.findIndex(
          (p) => p._id === action.payload._id
        );
        if (sellerIndex !== -1)
          state.sellerProduct[sellerIndex] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getMyCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getMyCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeItem.fulfilled, (state, action) => {
        state.cart = action.payload;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.cart = action.payload;
      });
  },
});

export default productSlice.reducer;
