import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ tenantId, search, page, limit, sortBy, sortOrder }) => {
    const response = await api.get('/products', {
      params: { tenantId, search, page, limit, sortBy, sortOrder },
    });
    return response.data;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async ({ tenantId, sku, name, description, category, reorderThreshold, costPerUnit, status }, { rejectWithValue }) => {
    try {
      const response = await api.post('/products', {
        tenantId, sku, name, description, category, reorderThreshold, costPerUnit, status,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, ...data }) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

export const fetchProductStats = createAsyncThunk(
  'products/fetchProductStats',
  async ({ tenantId }) => {
    const response = await api.get('/products/stats', {
      params: { tenantId },
    });
    return response.data;
  }
);

export const fetchActiveProducts = createAsyncThunk(
  'products/fetchActiveProducts',
  async ({ tenantId }) => {
    const response = await api.get('/products/active', {
      params: { tenantId },
    });
    return response.data;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    current: null,
    activeProducts: [],
    stats: { total: 0, active: 0, inactive: 0 },
    total: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchProductStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchActiveProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.activeProducts = action.payload;
      })
      .addCase(fetchActiveProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
