import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getFromInstance3 } from "../../services/ApiEndpoint";

// Initial state
const initialState = {
  inspectorList: null,
  allocatedCalls: null, // Added for allocated calls data
  callListByInspector: null, // New state for storing call list by inspector
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  allocatedCallsStatus: "idle", // Separate status for allocated calls
  callListByInspectorStatus: "idle", // Separate status for call list by inspector
  error: null,
  allocatedCallsError: null, // Separate error for allocated calls
  callListByInspectorError: null, // Separate error for call list by inspector
};

// Async thunk to fetch inspector list
export const fetchInspectorList = createAsyncThunk(
  "pdiUser/fetchInspectorList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance3(
        `/v1/getinspectorApi/inspectorList`
      );
      console.log("🚀 ~ Inspector List Response:", response);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to fetch allocated calls
export const fetchAllocatedCalls = createAsyncThunk(
  "pdiUser/fetchAllocatedCalls",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance3(
        `/v1/allocationApi/allocatedCalls`
      );
      console.log("🚀 ~ Allocated Calls Response:", response);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// New async thunk to fetch call list by inspector
export const getCallListByInspector = createAsyncThunk(
  "pdiUser/getCallListByInspector",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance3(
        `/v1/inspectorCallApi/getCallList`
      );
      console.log("🚀 ~ Call List by Inspector Response:", response);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const pdiUserSlice = createSlice({
  name: "pdiUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch inspector list
      .addCase(fetchInspectorList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInspectorList.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.inspectorList = action.payload;
      })
      .addCase(fetchInspectorList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Fetch allocated calls
      .addCase(fetchAllocatedCalls.pending, (state) => {
        state.allocatedCallsStatus = "loading";
      })
      .addCase(fetchAllocatedCalls.fulfilled, (state, action) => {
        state.allocatedCallsStatus = "succeeded";
        state.allocatedCalls = action.payload;
      })
      .addCase(fetchAllocatedCalls.rejected, (state, action) => {
        state.allocatedCallsStatus = "failed";
        state.allocatedCallsError = action.payload;
      })

      // Fetch call list by inspector
      .addCase(getCallListByInspector.pending, (state) => {
        state.callListByInspectorStatus = "loading";
      })
      .addCase(getCallListByInspector.fulfilled, (state, action) => {
        state.callListByInspectorStatus = "succeeded";
        state.callListByInspector = action.payload;
      })
      .addCase(getCallListByInspector.rejected, (state, action) => {
        state.callListByInspectorStatus = "failed";
        state.callListByInspectorError = action.payload;
      });
  },
});

// Export reducer
export default pdiUserSlice.reducer;
