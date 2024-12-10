import { useEffect, useState } from 'react';
import {
  fetchInspectorList,
  fetchAllocatedCalls,
} from '../features/pdiUserSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlineClose } from 'react-icons/ai';
import { postToInstance3 } from '../../services/ApiEndpoint';

const AllocateModal = ({ selectedData, onClose }) => {
  if (!selectedData) return null;

  const dispatch = useDispatch();
  const {
    inspectorList,
    status: loading,
    error,
  } = useSelector(state => state.pdiUser);
  const [selectedPerson, setSelectedPerson] = useState('');
  console.log('🚀 ~ AllocateModal ~ inspectorList:', inspectorList);

  useEffect(() => {
    dispatch(fetchInspectorList());
  }, [dispatch]);

  const handleAllocate = async personId => {
    const payload = {
      inspector_id: personId,
      call_no: selectedData._id,
    };

    try {
      const response = await postToInstance3(
        '/v1/allocationApi/allocate',
        payload
      );
      alert('Allocation successful!');
      dispatch(fetchAllocatedCalls());

      onClose(); // Close the modal after successful allocation
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      alert('Failed to allocate. Please try again.');
    }
  };

  return (
    <div className="fixed  inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-3xl rounded shadow p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-medium text-gray-800">
            Allocate Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✖
          </button>
        </div>

        {/* Allocation Details */}
        <div>
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="py-2">Equipment Sl No.</th>
                <th className="py-2">Model</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">{selectedData.equipment_sl_no}</td>
                <td className="py-2">{selectedData.model || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Loading and Error Messages */}
        {loading === 'loading' && (
          <p className="text-gray-600 mt-3">Loading inspectors...</p>
        )}
        {error && <p className="text-red-500 mt-3">{error}</p>}

        {/* Person Selection Dropdown */}
        <div className="mt-3 flex items-center">
          <div className="relative w-full">
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedPerson}
              onChange={e => setSelectedPerson(e.target.value)}
            >
              <option value="" disabled>
                -- Select a Person --
              </option>
              {inspectorList?.map(person => (
                <option key={person._id} value={person._id}>
                  {`${person.fullName} (Emp. Code: ${person.employee_code}, Allocated: ${person.allocatedCallCount})`}
                </option>
              ))}
            </select>

            {selectedPerson && (
              <button
                onClick={() => setSelectedPerson('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <AiOutlineClose size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={() => handleAllocate(selectedPerson)}
            disabled={loading === 'loading' || !selectedPerson || error}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Allocate
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllocateModal;
