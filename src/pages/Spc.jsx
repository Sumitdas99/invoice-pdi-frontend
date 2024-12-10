import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllocatedRequests } from '../features/serviceRequestSlice'; // Redux action

const Spc = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth); // Extract user data from Redux
  const { spcAllocated, loading, error } = useSelector(
    state => state.serviceRequest
  ); // Extract user data from Redux
  console.log('🚀 ~ Spc ~ spcAllocated:', spcAllocated);
  // const { requests, loading, error } = useSelector(state => state.requests); // Extract state from Redux

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchAllocatedRequests(user.email)); // Dispatch API call action
    }
  }, [dispatch, user?.email]);

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-300 mb-6">
        Allocated Requests for {user?.name || 'SPC'}
      </h1>

      {loading && (
        <p className="text-gray-700 dark:text-gray-300">Loading...</p>
      )}
      {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
      {!loading && !error && spcAllocated.length < 0 && (
        <p className="text-gray-700 dark:text-gray-300">
          No requests allocated to your email.
        </p>
      )}
      {!loading && !error && (
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                Billing Request ID
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                quotationNo
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                Customer Name
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                Equipment Serial No
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                Model No
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                QuoteStatus
              </th>
              <th className="border border-gray-300 dark:border-gray-600 px-2 py-1">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {spcAllocated.map(request => (
              <tr
                key={request._id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {request.serviceRequestId}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {request.quotationNo}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {request.customerName}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {request.equipmentSerialNo}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {request.modelNo}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {request.quoteStatus}
                </td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">
                  {request.remarks || 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Spc;
