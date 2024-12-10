import React, { useState } from 'react';
import { FaEye, FaSortUp, FaSortDown } from 'react-icons/fa';
import PiModal from './Pimodal';
import AllocateModal from './AllocateModal';
import PiDetailModal from './PiDetailModal';
import { RiTaskFill } from 'react-icons/ri';
import Switch from 'react-switch'; // Import the Switch component

const PiDataTable = ({ piData }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedData, setSelectedData] = useState(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false); // New state for detail modal

  // Filtering
  const filteredData = piData?.filter(item =>
    Object.values(item)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Sorting
  const sortedData = filteredData?.sort((a, b) => {
    if (sortConfig.key === null) return 0;
    const valueA = a[sortConfig.key];
    const valueB = b[sortConfig.key];
    if (typeof valueA === 'string') {
      return (
        valueA.localeCompare(valueB) * (sortConfig.direction === 'asc' ? 1 : -1)
      );
    }
    return (valueA - valueB) * (sortConfig.direction === 'asc' ? 1 : -1);
  });

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedData = sortedData?.slice(indexOfFirstRow, indexOfLastRow);

  // Sorting handler
  const handleSort = key => {
    setSortConfig(prevState => ({
      key,
      direction:
        prevState.key === key && prevState.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortArrow = key => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="inline ml-1 text-xs" />
    ) : (
      <FaSortDown className="inline ml-1 text-xs" />
    );
  };

  const handleViewClick = item => {
    setSelectedData(item); // Set the selected data
    setShowAllocateModal(true); // Show the Allocate Modal instead of the PI Modal
  };

  const handleDetailClick = item => {
    setSelectedData(item); // Set the selected data
    setShowDetailModal(true); // Show the Detail Modal
  };

  const closeModal = () => {
    setSelectedData(null);
    setShowAllocateModal(false);
  };

  const handleSwitchChange = (field, value, sr_no) => {
    // Here you can handle the switch change to update the data
    // For now, just console log the field, value, and sr_no
    console.log(`${field} for ${sr_no} changed to ${value}`);
  };
  return (
    <div className="overflow-x-auto rounded-lg">
      <h1>Pi Data Table</h1>

      {/* Search Input */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 w-full max-w-sm outline-none"
        />
      </div>

      {/* Table */}
      <table className="min-w-full bg-white table-auto border border-gray-200 rounded-lg select-none">
        <thead className="bg-gray-100 text-sm font-medium text-gray-700">
          <tr>
            <th className="px-3 py-1.5 text-left">SL NO</th>
            <th className="px-3 py-1.5 text-left">Equipment SL No</th>
            <th className="px-3 py-1.5 text-left">Active</th>
            <th className="px-3 py-1.5 text-left">Created Date</th>
            <th className="px-3 py-1.5 text-left">Upcoming Date</th>
            <th className="px-3 py-1.5 text-left">Overdue Status</th>
            <th className="px-3 py-1.5 text-left">Pause Notification</th>
            <th className="px-3 py-1.5 text-left">Reject</th>
            <th className="px-3 py-1.5 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData?.map(item => (
            <tr
              key={item.sr_no}
              className="border-t border-b hover:bg-gray-50 even:bg-gray-50 transition-colors"
            >
              <td className="px-3 py-1 text-sm text-gray-700">{item.sr_no}</td>
              <td className="px-3 py-1 text-sm text-gray-700">
                {item.equipment_sl_no}
              </td>
              <td className="px-3 py-1 text-sm text-gray-700">
                {item.active ? 'Yes' : 'No'}
              </td>
              <td className="px-3 py-1 text-sm text-gray-700">
                {new Date(item.created_date).toLocaleDateString()}
              </td>

              <td className="px-3 py-1 text-sm text-gray-700">
                {new Date(item.upcoming_date).toLocaleDateString()}
              </td>
              <td className="px-3 py-1 text-sm text-gray-700">
                {item.overdue_status}
              </td>
              <td className="px-3 py-1 text-sm text-gray-700">
                {/* Reject Switch */}
                <Switch
                  checked={item.reject === 'Yes'}
                  onChange={checked =>
                    handleSwitchChange(
                      'reject',
                      checked ? 'Yes' : 'No',
                      item.sr_no
                    )
                  }
                  offColor="#bbb"
                  onColor="#F44336"
                  height={22}
                />
              </td>
              <td className="px-3 py-1 text-sm text-gray-700">
                {/* Reject Switch */}
                <Switch
                  checked={item.reject === 'Yes'}
                  onChange={checked =>
                    handleSwitchChange(
                      'reject',
                      checked ? 'Yes' : 'No',
                      item.sr_no
                    )
                  }
                  offColor="#bbb"
                  onColor="#F44336"
                  height={22}
                />
              </td>
              <td className="px-3 py-1 flex justify-start items-center text-sm text-gray-700">
                <button
                  onClick={() => handleViewClick(item)}
                  className="flex items-center px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                >
                  <RiTaskFill className="mr-1" /> Allocate
                </button>
                <button
                  onClick={() => handleDetailClick(item)}
                  className="flex items-center ml-1 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                >
                  <FaEye className="mr-1" /> Detail
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className={`px-3 py-1 bg-gray-300 rounded ${
            currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-400'
          }`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-600">
          Page {currentPage} of {Math.ceil(filteredData?.length / rowsPerPage)}
        </p>
        <button
          disabled={
            currentPage === Math.ceil(filteredData?.length / rowsPerPage)
          }
          onClick={() => setCurrentPage(prev => prev + 1)}
          className={`px-3 py-1 bg-gray-300 rounded ${
            currentPage === Math.ceil(filteredData?.length / rowsPerPage)
              ? 'cursor-not-allowed'
              : 'hover:bg-gray-400'
          }`}
        >
          Next
        </button>
      </div>

      {/* Modals */}
      {showAllocateModal && (
        <AllocateModal
          selectedData={selectedData}
          onClose={() => setShowAllocateModal(false)}
        />
      )}

      {showDetailModal && selectedData && (
        <PiDetailModal
          selectedData={selectedData}
          onClose={() => setShowDetailModal(false)} // Close the Detail Modal
        />
      )}
    </div>
  );
};

export default PiDataTable;
