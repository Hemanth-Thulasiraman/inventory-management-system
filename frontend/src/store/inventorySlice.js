import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (params) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  }
);

export const fetchInventoryById = createAsyncThunk(
  'inventory/fetchInventoryById',
  async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  }
);

export const updateInventory = createAsyncThunk(
  'inventory/updateInventory',
  async ({ id, ...data }) => {
    const response = await api.put(`/inventory/${id}`, { currentStock: data.currentStock });
    return response.data;
  }
);

export const deleteInventory = createAsyncThunk(
  'inventory/deleteInventory',
  async (id) => {
    await api.delete(`/inventory/${id}`);
    return id;
  }
);

export const fetchBelowThreshold = createAsyncThunk(
  'inventory/fetchBelowThreshold',
  async ({ tenantId }) => {
    const response = await api.get('/inventory/below-threshold', {
      params: { tenantId },
    });
    return response.data;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    current: null,
    belowThreshold: 0,
    total: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInventoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchInventoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInventory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInventory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBelowThreshold.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBelowThreshold.fulfilled, (state, action) => {
        state.loading = false;
        state.belowThreshold = action.payload.belowThreshold;
      })
      .addCase(fetchBelowThreshold.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default inventorySlice.reducer;
