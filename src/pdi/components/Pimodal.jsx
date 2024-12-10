import { useSelector } from "react-redux";

const PiModal = ({ selectedData, onClose, onAllocate }) => {
  console.log("🚀 --------------------------------------🚀");
  console.log("🚀  PiModal  selectedData", selectedData);
  console.log("🚀 --------------------------------------🚀");

  if (!selectedData) return null;

  const { allocatedCalls } = useSelector((state) => state.pdiUser);
  console.log("🚀 ------------------------------------------🚀");
  console.log("🚀  PiModal  allocatedCalls", allocatedCalls);
  console.log("🚀 ------------------------------------------🚀");

  // Filter allocatedCalls to find the matching sr_no
  const matchingCall = allocatedCalls.find(
    (call) => call.sr_no === selectedData.sr_no
  );

  // If a match is found, update allocation_status to "allocated"
  // if (matchingCall) {
  //   selectedData.allocation_status = "allocated";
  // }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">PI Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✖
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-200">
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-700">
                  Equipment SL No.
                </td>
                <td className="px-4 py-2">{selectedData.equipment_sl_no}</td>
                <td className="px-4 py-2 font-medium text-gray-700">Model</td>
                <td className="px-4 py-2">{selectedData.model || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-700">GRN No.</td>
                <td className="px-4 py-2">{selectedData.grn_no || "N/A"}</td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  GRN Status
                </td>
                <td className="px-4 py-2 text-yellow-500">
                  {selectedData.grn_status || "Pending"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-700">PI SL</td>
                <td className="px-4 py-2">{selectedData.pi_sl || "N/A"}</td>
                <td className="px-4 py-2 font-medium text-gray-700">Invoice</td>
                <td className="px-4 py-2">{selectedData.invoice || "N/A"}</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-700">
                  PI Upcoming Date
                </td>
                <td className="px-4 py-2">
                  {selectedData.pi_upcoming_date || "N/A"}
                </td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  PI Last Date
                </td>
                <td className="px-4 py-2">
                  {selectedData.pi_last_date || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2 font-medium text-gray-700">
                  Allocation Status
                </td>
                <td
                  className={`px-4 py-2 ${
                    matchingCall ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {matchingCall ? "allocated" : "Not Allocated"}
                </td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  Revoke Status
                </td>
                <td className="px-4 py-2 text-red-500">
                  {selectedData.revoke_status || "Pending"}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-medium text-gray-700">
                  Person Name
                </td>
                <td className="px-4 py-2">
                  {selectedData.person_name || "Not Available"}
                </td>
                <td className="px-4 py-2 font-medium text-gray-700">
                  Allocation Date
                </td>
                <td className="px-4 py-2">
                  {selectedData.allocation_date || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center mt-6 space-x-4">
          <button
            onClick={onAllocate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Allocate
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PiModal;
