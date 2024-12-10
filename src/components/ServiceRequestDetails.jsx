import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaEdit, FaSave } from 'react-icons/fa';
import { GrPowerReset } from 'react-icons/gr';
import { revokeBillingEditStatus } from '../features/serviceRequestSlice';
import { MdOutlineClose } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { fetchServiceRequestByStatus } from '../features/serviceRequestSlice';
import {
  fetchInvoices,
  fetchServiceRequest,
  updateServiceRequestStatus,
} from '../features/serviceRequestSlice';
import { Tooltip } from 'react-tooltip';

const ServiceRequestDetails = ({ selectedInvoice }) => {
  const dispatch = useDispatch();
  const { billingProgressStatus, quoteStatus } = useParams();

  const { details: invoiceData, loading } = useSelector(
    state => state.serviceRequest
  );
  console.log('🚀 ~ ServiceRequestDetails ~ invoiceData:', invoiceData);

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('OnHold');
  const [remarks, setRemarks] = useState('');

  const [editFields, setEditFields] = useState({
    equipmentSerialNo: false,
    modelNo: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  const [fieldValues, setFieldValues] = useState({
    equipmentSerialNo: '',
    modelNo: '',
  });

  useEffect(() => {
    if (selectedInvoice?.billingRequestId) {
      dispatch(fetchServiceRequest(selectedInvoice.billingRequestId));
    }
    setTimeout(() => {
      setIsVisible(true); // Trigger smooth animation
    }, 100);
  }, [dispatch, selectedInvoice]);

  const handleEditClick = (field, value) => {
    setEditFields({ ...editFields, [field]: true });
    setFieldValues({ ...fieldValues, [field]: value });
  };
  const handleSrEditClick = () => {
    setIsEditing(true);
  };

  const handleStatusSubmit = async () => {
    if (!selectedStatus || !remarks.trim()) {
      alert('Both status and remarks are required.');
      return;
    }
    const payload = {
      billingRequestId: invoice.billingRequestId,
      billingRqstStatus: selectedStatus,
      remarks,
    };
    await dispatch(updateServiceRequestStatus(payload));
    await dispatch(fetchServiceRequest(selectedInvoice.billingRequestId));
    await dispatch(fetchServiceRequestByStatus(billingProgressStatus));
    await dispatch(fetchInvoices());
    setIsEditing(false);
  };

  const handleFieldChange = (field, value) => {
    setFieldValues({ ...fieldValues, [field]: value });
  };

  const handleSave = async field => {
    if (!fieldValues[field].trim()) {
      alert(`${field} cannot be empty.`);
      return;
    }

    await dispatch(
      updateServiceRequestStatus({ billingRequestId: invoice.billingRequestId })
    );
    await dispatch(fetchServiceRequest(selectedInvoice.billingRequestId));
    setEditFields({ ...editFields, [field]: false });
  };
  const handleRevoke = async () => {
    const payload = { billingRequestId: invoice.billingRequestId }; // Correct payload structure
    await dispatch(revokeBillingEditStatus(payload));

    await dispatch(fetchServiceRequest(selectedInvoice.billingRequestId));
    await dispatch(fetchServiceRequest(selectedInvoice.billingRequestId));
    await dispatch(fetchInvoices());

    setIsModalOpen(false);
  };
  const invoice = Array.isArray(invoiceData) ? invoiceData[0] : invoiceData;

  return (
    <div className="flex flex-col items-center justify-between p-2 sm:p-4   min-h-screen">
      {invoice ? (
        <div
          className={`transform w-[80vw] lg:w-[50vw]  transition-all duration-500 ease-in-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          } p-6`}
        >
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Billing Request Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Service Request ID & Quotation No */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Billing Request ID
              </p>
              <p className="text-base text-gray-800 dark:text-gray-300 font-medium">
                {invoice.billingRequestId}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Quotation No
              </p>
              <p className="text-base text-gray-800 dark:text-gray-300 font-medium">
                {invoice.quotationNo}
              </p>
            </div>

            {/* Customer Name & Equipment Serial No */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Customer Name
              </p>
              <p className="text-base text-gray-800 dark:text-gray-300 font-medium">
                {invoice.customerName}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Equipment Serial No
              </p>
              <div className="flex items-center my-1 space-x-1">
                {editFields.equipmentSerialNo ? (
                  <>
                    <input
                      type="text"
                      className="p-2 w-[200px] border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-brandYellow"
                      value={fieldValues.equipmentSerialNo}
                      onChange={e =>
                        handleFieldChange('equipmentSerialNo', e.target.value)
                      }
                    />
                    <button
                      className="px-2 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                      onClick={() => handleSave('equipmentSerialNo')}
                    >
                      <FaSave />
                    </button>
                    <button
                      className="px-2 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300"
                      onClick={() =>
                        setEditFields({
                          ...editFields,
                          equipmentSerialNo: false,
                        })
                      }
                    >
                      <MdOutlineClose />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-base text-gray-800 dark:text-gray-300 font-medium">
                      {invoice.equipmentSerialNo}
                    </span>
                    <FaEdit
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                      onClick={() =>
                        handleEditClick(
                          'equipmentSerialNo',
                          invoice.equipmentSerialNo
                        )
                      }
                    />
                  </>
                )}
              </div>
            </div>

            {/* Quote Status & Sr Status */}

            {/* Quote Status & SrStatus */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Quote Status
              </p>
              <p className="text-base text-gray-800 dark:text-gray-300 font-medium">
                {invoice.quoteStatus}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Billing Req.Status
              </p>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <>
                    <span className="text-base text-gray-800 dark:text-gray-300 font-medium">
                      <div className="">
                        {invoice.billingEditStatus === 'OnHold' ||
                        invoice.billingEditStatus === 'Rejected' ? (
                          <span className="text-green-500">
                            {invoice.billingEditStatus}
                          </span>
                        ) : (
                          <span>{invoice.billingProgressStatus}</span>
                        )}
                      </div>
                    </span>
                    {invoice.billingProgressStatus !== 'Closed' && (
                      <>
                        <FaEdit
                          data-tooltip-id="edit-tooltip"
                          data-tooltip-content="Edit"
                          className="text-gray-500 outline-none dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                          onClick={handleSrEditClick}
                        />
                        <Tooltip id="edit-tooltip" />

                        {invoice.billingEditStatus && (
                          <button onClick={() => setIsModalOpen(true)}>
                            <GrPowerReset
                              data-tooltip-id="revoke-tooltip"
                              data-tooltip-content="Revoke Status"
                              className="text-lg outline-none cursor-pointer"
                            />
                            <Tooltip id="revoke-tooltip" />
                          </button>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <div>
                    <select
                      className="py-2 px-1 text-sm border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-1 outline-none focus:ring-brandYellow"
                      value={selectedStatus}
                      onChange={e => setSelectedStatus(e.target.value)}
                    >
                      <option value="OnHold">OnHold</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <textarea
                      className="mt-2 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-1 outline-none focus:ring-brandYellow"
                      placeholder="Add remarks..."
                      rows="2"
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                    ></textarea>

                    <div className="flex space-x-3 mt-3">
                      <button
                        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                        onClick={handleStatusSubmit}
                      >
                        Submit
                      </button>
                      <button
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300"
                        onClick={() => setIsEditing(false)}
                      >
                        <MdOutlineClose />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Model No */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Model No
              </p>
              <div className="flex items-center my-1 space-x-2">
                {editFields.modelNo ? (
                  <>
                    <input
                      type="text"
                      className="p-2 w-[200px] border rounded bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 outline-none focus:ring-1 focus:ring-brandYellow"
                      value={fieldValues.modelNo}
                      onChange={e =>
                        handleFieldChange('modelNo', e.target.value)
                      }
                    />
                    <button
                      className="px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                      onClick={() => handleSave('modelNo')}
                    >
                      <FaSave />
                    </button>
                    <button
                      className="px-3 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300"
                      onClick={() =>
                        setEditFields({ ...editFields, modelNo: false })
                      }
                    >
                      <MdOutlineClose />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-base text-gray-800 dark:text-gray-300 font-medium">
                      {invoice.modelNo}
                    </span>
                    <FaEdit
                      className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
                      onClick={() =>
                        handleEditClick('modelNo', invoice.modelNo)
                      }
                    />
                  </>
                )}
              </div>
            </div>

            {/* Allocation Details */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allocation for Quotation
              </p>
              <p className="text-md text-gray-800 dark:text-gray-300 font-normal">
                {invoice.allocatedTo?.fullName} / {invoice.allocatedTo?.email}
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Remarks
              </p>
              <p className="text-base text-gray-800 dark:text-gray-300 font-medium">
                {invoice.remarks || 'N/A'}
              </p>
            </div>

            {/* Allocation for Invoice */}
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Allocation for Invoice
              </p>
              <p className="text-md text-gray-800 dark:text-gray-300 font-normal">
                {invoice.reallocatedTo?.fullName} /{' '}
                {invoice.reallocatedTo?.email}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-700 dark:text-gray-300">
          No service request found.
        </p>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 w-80">
            <p className="text-center text-gray-700 dark:text-gray-300">
              Are you sure you want to revoke the status?
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
                onClick={handleRevoke}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded shadow hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceRequestDetails;
