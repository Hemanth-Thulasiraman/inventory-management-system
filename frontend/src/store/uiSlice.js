import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { selectedTenantId: null },
  reducers: {
    setSelectedTenant: (state, action) => {
      state.selectedTenantId = action.payload;
    },
  },
});

export const { setSelectedTenant } = uiSlice.actions;
export default uiSlice.reducer;
