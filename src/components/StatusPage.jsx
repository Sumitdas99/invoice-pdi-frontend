import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchInvoices,
  setSelectedZone,
} from '../features/serviceRequestSlice';
import LoadingSpinner from './LoadingSpinner';
import StatusChart from './BarChart';

const StatusPage = () => {
  const dispatch = useDispatch();
  const { loading, statusCounts, selectedZone, invoices } = useSelector(
    state => state.serviceRequest
  );
  const zones = [
    'All',
    'Zone1',
    'Zone2',
    'Zone3',
    'Zone4',
    'Zone5',
    'Zone6',
    'Zone7',
    'Zone8',
  ];

  const navigate = useNavigate();
  const handleZoneChange = zone => {
    dispatch(setSelectedZone(zone));
  };

  useEffect(() => {
    dispatch(fetchInvoices());
  }, []);

  const handleCardClick = status => {
    navigate(`/status/${status}`);
  };

  const handleQuoteClick = status => {
    navigate(`/quoteStatus/${status}`);
  };

  const handleBillingEditClick = status => {
    navigate(`/billingEditStatus/${status}`);
  };

  const srStatusColors = {
    PendingForQuotationAllocation: {
      bg: 'bg-yellow-400',
      border: 'border-yellow-500',
    },
    QuotationInProgress: {
      bg: 'bg-green-500',
      border: 'border-green-600',
    },
    PendingforInvoiceAllocation: {
      bg: 'bg-blue-500',
      border: 'border-blue-600',
    },
    InvoicingInProgress: {
      bg: 'bg-indigo-500',
      border: 'border-indigo-600',
    },
  };

  const quoteStatusColors = {
    PendingRelease: {
      bg: 'bg-yellow-400',
      border: 'border-yellow-500',
    },
    ApprovalPending: {
      bg: 'bg-green-500',
      border: 'border-green-600',
    },
    BillingPending: {
      bg: 'bg-blue-500',
      border: 'border-blue-600',
    },
    Rejected: {
      bg: 'bg-red-500',
      border: 'border-red-600',
    },
  };

  const billingEditColors = {
    OnHold: {
      bg: 'bg-purple-500',
      border: 'border-purple-600',
    },
    Reject: {
      bg: 'bg-red-500',
      border: 'border-red-600',
    },
  };

  const statusLabels = {
    PendingForQuotationAllocation: 'Pending for Quotation Allocation',
    QuotationInProgress: 'Quotation In Progress',
    PendingforInvoiceAllocation: 'Pending for Invoice Allocation',
    InvoicingInProgress: 'Invoicing In Progress',
    OnHold: 'On Hold',
    Reject: 'Reject',
    PendingRelease: 'Pending Release',
    ApprovalPending: 'Approval Pending',
    BillingPending: 'Billing Pending',
    Rejected: 'Rejected',
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-start justify-start rounded-lg">
      <div className="w-full py-4 mb-6">
        <div className="w-[50%] mb-4">
          <label
            htmlFor="zone-select"
            className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1"
          >
            Select Zone
          </label>
          <select
            id="zone-select"
            value={selectedZone}
            onChange={e => handleZoneChange(e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded focus:ring focus:ring-indigo-300 focus:border-indigo-400 focus:outline-none transition-all"
          >
            {zones.map(zone => (
              <option
                key={zone}
                value={zone}
                className="text-gray-700 dark:text-gray-300"
              >
                {zone === 'All' ? 'All' : zone.replace(/\D/g, '')}
              </option>
            ))}
          </select>
        </div>

        {/* Billing Request Status Section */}
        <h2 className="text-start text-2xl font-extrabold mb-6 text-gray-700 dark:text-gray-300">
          Billing Request Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-y-4 gap-x-4">
          {Object.keys(srStatusColors).map(status => (
            <div
              key={status}
              onClick={() => handleCardClick(status)}
              className={`px-3 py-3 bg-white dark:bg-gray-600 dark:text-gray-200 text-gray-800 ${srStatusColors[status].border} border-b-2 rounded-md transition-transform transform hover:shadow-sm flex flex-col items-center cursor-pointer min-h-[120px]`} // Reduced height for lighter cards
            >
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-md font-medium text-center">
                  {statusLabels[status]}
                </p>
                <p className="text-xl font-semibold text-center mt-2">
                  {statusCounts?.srStatusCounts[status] || 0}
                </p>
              </div>
            </div>
          ))}
          {Object.keys(billingEditColors).map(status => (
            <div
              key={status}
              onClick={() => handleBillingEditClick(status)}
              className={`px-3 py-3 bg-white dark:bg-gray-600 dark:text-gray-200 text-gray-800 ${billingEditColors[status].border} border-b-2 rounded-md transition-transform transform hover:shadow-sm flex flex-col items-center cursor-pointer min-h-[120px]`} // Reduced height for lighter cards
            >
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-md font-medium text-center">
                  {statusLabels[status]}
                </p>
                <p className="text-xl font-semibold text-center mt-2">
                  {statusCounts?.billingEditCounts[status] || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quotation Status Section */}
      <div className="w-full py-2 mb-4">
        <h2 className="text-start text-2xl font-extrabold mb-6 text-gray-700 dark:text-gray-300">
          Quotation Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-y-4 gap-x-4">
          {Object.keys(quoteStatusColors).map(status => (
            <div
              key={status}
              onClick={() => handleQuoteClick(status)}
              className={`px-3 py-3 bg-white dark:bg-gray-600 dark:text-gray-200 text-gray-800 ${quoteStatusColors[status].border} border-b-2 rounded-md transition-transform transform hover:shadow-sm flex flex-col items-center cursor-pointer min-h-[120px]`} // Reduced height for lighter cards
            >
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-md font-medium text-center">
                  {statusLabels[status]}
                </p>
                <p className="text-xl font-semibold text-center mt-2">
                  {statusCounts.quoteStatusCounts[status] || 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <StatusChart /> */}
    </div>
  );
};

export default StatusPage;
