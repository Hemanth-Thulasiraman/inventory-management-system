import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params) => {
    const response = await api.get('/orders', { params });
    return response.data;
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ tenantId, productId, quantity, notes }, { rejectWithValue }) => {
    try {
      const response = await api.post('/orders', { tenantId, productId, quantity, notes });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, ...data }) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  }
);

export const confirmOrder = createAsyncThunk(
  'orders/confirmOrder',
  async (id) => {
    const response = await api.post(`/orders/${id}/confirm`);
    return response.data;
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (id) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id) => {
    await api.delete(`/orders/${id}`);
    return id;
  }
);

export const fetchOrderStats = createAsyncThunk(
  'orders/fetchOrderStats',
  async ({ tenantId }) => {
    const response = await api.get('/orders/stats', {
      params: { tenantId },
    });
    return response.data;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    current: null,
    stats: { total: 0, pending: 0, created: 0 },
    total: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
