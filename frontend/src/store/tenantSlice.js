import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchTenants = createAsyncThunk(
  'tenants/fetchTenants',
  async ({ search, page, limit, sortBy, sortOrder }) => {
    const response = await api.get('/tenants', {
      params: { search, page, limit, sortBy, sortOrder },
    });
    return response.data;
  }
);

export const fetchTenantById = createAsyncThunk(
  'tenants/fetchTenantById',
  async (id) => {
    const response = await api.get(`/tenants/${id}`);
    return response.data;
  }
);

export const createTenant = createAsyncThunk(
  'tenants/createTenant',
  async ({ name }, { rejectWithValue }) => {
    try {
      const response = await api.post('/tenants', { name });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateTenant = createAsyncThunk(
  'tenants/updateTenant',
  async ({ id, ...data }) => {
    const response = await api.put(`/tenants/${id}`, data);
    return response.data;
  }
);

export const deleteTenant = createAsyncThunk(
  'tenants/deleteTenant',
  async (id) => {
    await api.delete(`/tenants/${id}`);
    return id;
  }
);

const tenantSlice = createSlice({
  name: 'tenants',
  initialState: {
    items: [],
    current: null,
    total: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTenantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tenantSlice.reducer;
