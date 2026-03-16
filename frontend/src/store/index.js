import { configureStore } from '@reduxjs/toolkit';
import tenantReducer from './tenantSlice';
import productReducer from './productSlice';
import inventoryReducer from './inventorySlice';
import orderReducer from './orderSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    tenants: tenantReducer,
    products: productReducer,
    inventory: inventoryReducer,
    orders: orderReducer,
    ui: uiReducer,
  },
});
