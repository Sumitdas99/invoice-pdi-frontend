import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getFromInstance3, postToInstance3 } from "../../services/ApiEndpoint"; // Adjust the path as necessary

// Example async thunk for fetching PDI data
export const fetchPdiData = createAsyncThunk(
  "pdi/fetchPdiData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance3("/v1/pdiCallApi/pdiCallList"); // Replace with actual endpoint
      return response.data?.pdiData;
    } catch (error) {
      console.error("Error fetching PDI data:", error);
      return rejectWithValue(error.response?.data || "Error fetching PDI data");
    }
  }
);

// Initial state
const initialState = {
  pdiData: [],
  pdiCount: 0,
  loading: false,
  error: null,
};

// Create the slice
const pdiSlice = createSlice({
  name: "pdi",
  initialState,
  reducers: {
    clearPdiError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchPdiData
      .addCase(fetchPdiData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPdiData.fulfilled, (state, action) => {
        state.loading = false;
        state.pdiData = action.payload;
        state.pdiCount = action.payload.length;
      })
      .addCase(fetchPdiData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearPdiError } = pdiSlice.actions;

// Export reducer
export default pdiSlice.reducer;
