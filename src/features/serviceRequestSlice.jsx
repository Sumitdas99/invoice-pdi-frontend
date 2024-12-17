// src/features/serviceRequest/serviceRequestSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getFromInstance1,
  putToInstance1,
  postToInstance1,
} from '../services/ApiEndpoint';

// Create Async Thunk for fetching invoices
export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance1('/api/v1/display-report');
      if (response.status === 200) {
        return response.data?.billingRequests || [];
      } else {
        throw new Error('Failed to fetch invoices');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchAllEmails = createAsyncThunk(
  'emails/fetchAllEmails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance1('/api/v1/all-billing-agent');
      return response.data?.empData; // Assuming response.data.empList is the list of emails
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch emails'
      );
    }
  }
);
export const fetchAllQuotationNo = createAsyncThunk(
  'emails/fetchAllQuotationNo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFromInstance1('/api/v1/fetch-quote-status');
      return response.data?.quote; // Assuming response.data.empList is the list of emails
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch emails'
      );
    }
  }
);
export const fetchServiceRequest = createAsyncThunk(
  'serviceRequest/fetchDetails',
  async (billingRequestId, thunkAPI) => {
    try {
      // Send billingRequestId as a query parameter
      const response = await getFromInstance1(
        `/api/v1/display-report?billingRequestId=${billingRequestId}`
      );
      return response.data?.billingRequests; // Extract displayReport from the response
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
// Async thunk for updating service request status
export const updateServiceRequestStatus = createAsyncThunk(
  'serviceRequest/updateStatus',
  async (payload, thunkAPI) => {
    try {
      const response = await putToInstance1(
        '/api/user/v1/update-existing-sr',
        payload
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchAllocatedRequests = createAsyncThunk(
  'requests/fetchAllocatedRequests',
  async (email, { rejectWithValue }) => {
    try {
      const response = await postToInstance1('/api/user/v1/get-allocated-spc', {
        email,
      }); // Send email in the body
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'An error occurred'
      );
    }
  }
);
// fetch service request by status
export const fetchServiceRequestByStatus = createAsyncThunk(
  'serviceRequests/fetch',
  async ({ billingProgressStatus, quoteStatus }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (billingProgressStatus)
        queryParams.append('billingProgressStatus', billingProgressStatus);
      if (quoteStatus) queryParams.append('quoteStatus', quoteStatus);

      const response = await getFromInstance1(
        `/api/user/get-service-status?${queryParams.toString()}`
      );
      return response.data.serviceRequests;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch data');
    }
  }
);
export const revokeBillingEditStatus = createAsyncThunk(
  'serviceRequest/revokeBillingEditStatus',
  async (billingRequestId, { rejectWithValue }) => {
    try {
      const response = await putToInstance1(
        '/api/user/v1/revokeBillingEditStatus',
        billingRequestId
      );

      if (response.status === 200) {
        return response.data;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (error) {
      console.error('Error revoking billing status:', error);
      return rejectWithValue(error.message || 'Something went wrong.');
    }
  }
);
// Create slice for invoices
const serviceRequestSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    invoicesByStatus: [],
    emailList: [],
    quotationNoList: [],
    details: [],
    statusCounts: {
      srStatusCounts: {},
      quoteStatusCounts: {},
      billingEditCounts: {},
    },
    spcAllocated: [],
    selectedZone: 'All',
    loading: false,
    error: null,
  },

  reducers: {
    setSelectedZone: (state, action) => {
      // Set the selected zone from the action payload
      state.selectedZone = action.payload;

      // Filter the invoices based on the selected zone
      const filteredInvoices =
        action.payload === 'All'
          ? state.invoices
          : state.invoices.filter(invoice => invoice.zone === action.payload);

      // Initialize the counts for srStatus, quoteStatus, and billingEditStatus
      const srCounts = {};
      const quoteCounts = {};
      const billingEditCounts = {};

      // Loop through the filtered invoices and count each status
      filteredInvoices.forEach(invoice => {
        const { billingProgressStatus, quoteStatus, billingEditStatus } =
          invoice;

        // Count srStatus
        if (billingProgressStatus) {
          srCounts[billingProgressStatus] =
            (srCounts[billingProgressStatus] || 0) + 1;
        }

        // Count quoteStatus
        if (quoteStatus) {
          quoteCounts[quoteStatus] = (quoteCounts[quoteStatus] || 0) + 1;
        }

        // Count billingEditStatus
        if (billingEditStatus) {
          billingEditCounts[billingEditStatus] =
            (billingEditCounts[billingEditStatus] || 0) + 1;
        }
      });

      // Update the statusCounts with the newly calculated counts
      state.statusCounts = {
        srStatusCounts: srCounts,
        quoteStatusCounts: quoteCounts,
        billingEditCounts: billingEditCounts, // Changed from onHoldStatusCounts to billingEditCounts to match the state structure
      };
    },
  },

  extraReducers: builder => {
    builder
      .addCase(fetchInvoices.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;

        // Calculate srStatusCounts, quoteStatusCounts, and billingEditCounts
        const srCounts = {};
        const quoteCounts = {};
        const billingEditCounts = {};

        action.payload.forEach(invoice => {
          const { billingProgressStatus, quoteStatus, billingEditStatus } =
            invoice;

          // Count billingEditStatus
          billingEditCounts[billingEditStatus] =
            (billingEditCounts[billingEditStatus] || 0) + 1;

          // Only count srStatus and quoteStatus if billingEditStatus is not "OnHold" or "Rejected"
          if (
            billingEditStatus !== 'OnHold' &&
            billingEditStatus !== 'Rejected'
          ) {
            if (billingProgressStatus) {
              srCounts[billingProgressStatus] =
                (srCounts[billingProgressStatus] || 0) + 1;
            }

            if (quoteStatus) {
              quoteCounts[quoteStatus] = (quoteCounts[quoteStatus] || 0) + 1;
            }
          }
        });

        state.statusCounts = {
          srStatusCounts: srCounts,
          quoteStatusCounts: quoteCounts,
          billingEditCounts,
        };
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //   fetch emails
      .addCase(fetchAllEmails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmails.fulfilled, (state, action) => {
        state.loading = false;
        state.emailList = action.payload;
      })
      .addCase(fetchAllEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //   fetch all quotation no
      .addCase(fetchAllQuotationNo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuotationNo.fulfilled, (state, action) => {
        state.loading = false;
        state.quotationNoList = action.payload;
      })
      .addCase(fetchAllQuotationNo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch service request
      .addCase(fetchServiceRequest.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(fetchServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update service request status
      .addCase(updateServiceRequestStatus.pending, state => {
        state.loading = true;
      })
      .addCase(updateServiceRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.details = {
          ...state.details,
          billingProgressStatus: action.payload.billingProgressStatus,
        }; // Update status in state
      })
      .addCase(updateServiceRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // for allocated spc
      .addCase(fetchAllocatedRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllocatedRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.spcAllocated = action.payload;
      })
      .addCase(fetchAllocatedRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetch service request by status
      .addCase(fetchServiceRequestByStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceRequestByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.invoicesByStatus = action.payload;
      })
      .addCase(fetchServiceRequestByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // revoke billing edit status
      .addCase(revokeBillingEditStatus.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(revokeBillingEditStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = state.invoices.map(invoice =>
          invoice.billingRequestId === action.meta.arg
            ? { ...invoice, billingEditStatus: 'None' }
            : invoice
        );
      })
      .addCase(revokeBillingEditStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to revoke billing status.';
      });
  },
});
export const { setSelectedZone } = serviceRequestSlice.actions;
export default serviceRequestSlice.reducer;
