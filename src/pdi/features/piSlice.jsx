import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFromInstance3, postToInstance3 } from '../../services/ApiEndpoint'; // Adjust the path if necessary

// Example async thunk for fetching PI data
export const fetchPiData = createAsyncThunk(
  'pi/fetchPiData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance3('/v1/piCallApi/piCallList'); // Replace with actual endpoint
      return response.data?.piData;
    } catch (error) {
      console.error('Error fetching PI data:', error);
      return rejectWithValue(error.response?.data || 'Error fetching PI data');
    }
  }
);

// Initial state
const initialState = {
  piData: [],
  piCount: 0,
  loading: false,
  error: null,
};

// Create the slice
const piSlice = createSlice({
  name: 'pi',
  initialState,
  reducers: {
    clearPiError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Handle fetchPiData
      .addCase(fetchPiData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPiData.fulfilled, (state, action) => {
        state.loading = false;
        state.piData = action.payload;
        state.piCount = action.payload.length;
      })
      .addCase(fetchPiData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearPiError } = piSlice.actions;

export default piSlice.reducer;
