import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFromInstance2, postToInstance2 } from '../services/ApiEndpoint';
import toast from 'react-hot-toast';

// Helper function to delete a cookie by name
const deleteCookie = name => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Load the user from localStorage if available
const persistedUser = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

// Define the initial state
const initialState = {
  user: persistedUser, // Initialize with the persisted user
  users: [],
  loading: false,
  error: null,
};

// Async thunk for creating a user
export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await postToInstance2(
        '/api/v1/user/createUser',
        userData
      );
      console.log('🚀 ~ response:', response);
      toast.success(response.data?.message);
      return response.data?.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
// Async thunk for updating the user
export const updateUser = createAsyncThunk('auth/updateUser', async () => {
  try {
    const response = await getFromInstance2('/api/auth/checkUser');
    console.log('🚀 ~ updateUser ~ response:', response);
    return response.data;
  } catch (error) {
    throw error;
  }
});
// Async thunk for fetching users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance2('/api/v1/user');
      console.log('🚀 ~ response:', response);
      return response.data; // This will be the payload on success
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch users');
    }
  }
);
// Slice definition
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Persist user to localStorage
    },
    clearUser: state => {
      state.user = null;
      localStorage.removeItem('user'); // Remove user from localStorage
      deleteCookie('pdi_cookie'); // Remove the pdi_cookie
    },
  },
  extraReducers: builder => {
    // Update user cases
    builder.addCase(updateUser.pending, state => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload)); // Persist user to localStorage
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
      state.user = null;
      localStorage.removeItem('user'); // Clear user from localStorage
      deleteCookie('pdi_cookie'); // Remove the pdi_cookie
    });

    // Create user cases
    builder.addCase(createUser.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      // Append the new user to the existing users list
      if (state.users) {
        state.users = [...state.users, action.payload];
      } else {
        state.users = [action.payload]; // Handle case where users array is initially empty
      }
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Fetch users cases
    builder.addCase(fetchUsers.pending, state => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export the actions
export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;
