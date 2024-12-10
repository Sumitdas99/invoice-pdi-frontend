import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { postToInstance1 } from '../services/ApiEndpoint';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchAllEmails,
  fetchServiceRequestByStatus,
  fetchInvoices,
} from '../features/serviceRequestSlice';
import { FaFilePdf, FaTimes } from 'react-icons/fa';
import { MdFolderZip, MdPreview, MdAssignmentAdd } from 'react-icons/md';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ServiceRequestDetails } from '../components';
import { SideBar } from '../components';
import toast from 'react-hot-toast';

const StatusDataPage = () => {
  const dispatch = useDispatch();
  const { loading, invoicesByStatus, emailList } = useSelector(
    state => state.serviceRequest
  );
  console.log('🚀 ~ StatusDataPage ~ invoicesByStatus:', invoicesByStatus);
  const { billingProgressStatus, quoteStatus } = useParams();

  useEffect(() => {
    if (billingProgressStatus) {
      dispatch(fetchServiceRequestByStatus({ billingProgressStatus }));
    }
  }, [billingProgressStatus, dispatch]);
  useEffect(() => {
    if (quoteStatus) {
      dispatch(fetchServiceRequestByStatus({ quoteStatus }));
    }
  }, [quoteStatus, dispatch]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showSidebar, setShowSidebar] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [inputValue, setInputValue] = useState([
    { name: '', email: '', remarks: '' },
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const itemsPerPage = 12;

  useEffect(() => {
    dispatch(fetchAllEmails());
  }, []);

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = React.useMemo(() => {
    let sortableInvoices = [...invoicesByStatus];
    if (sortConfig.key) {
      sortableInvoices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableInvoices;
  }, [invoicesByStatus, sortConfig]);

  const filteredInvoices = sortedInvoices
    .filter(
      invoice =>
        invoice.billingEditStatus !== 'OnHold' &&
        invoice.billingEditStatus !== 'Rejected'
    )
    .filter(invoice =>
      Object.values(invoice).some(val =>
        val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const tableHeaders = [
    { label: 'BillingReqId', key: 'serviceRequestId' },
    { label: 'QuoteNo', key: 'quotationNo' },
    { label: 'QuoteStatus', key: 'quoteStatus' },
    { label: 'BillingReq-Status', key: 'billingProgressStatus' },
    { label: 'remarks', key: 'remarks' },
    { label: 'Zone', key: 'zone' },
    { label: 'EquipSlNo', key: 'equipmentSerialNo' },
    { label: 'ModelNo', key: 'modelNo' },
    { label: 'IndustryDiv', key: 'industryDiv' },
    { label: 'BillingPlant', key: 'billingPlant' },
    { label: 'Cus.Name', key: 'customerName' },
    { label: 'Files', key: 'attachments' },
    { label: 'Actions', key: 'actions' },
  ];

  const openRightSidebar = invoice => {
    setSelectedInvoice(invoice);
    setShowSidebar(true);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const openModal = invoice => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  // Handle input change for name or email search
  const handleInputChange = e => {
    const { value } = e.target;
    // Update the name field in inputValue
    setInputValue(prevInput => ({
      ...prevInput,
      name: value, // Update `name` with the search value
    }));

    // Filter suggestions based on name or email
    setSuggestions(
      emailList.filter(
        data =>
          data.name.toLowerCase().includes(value.toLowerCase()) ||
          data.email.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  // Handle suggestion click
  const handleSuggestionClick = suggestion => {
    setInputValue({
      name: suggestion.name,
      email: suggestion.email,
      remarks: inputValue.remarks, // Keep existing remarks if any
    });
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle remarks change
  const handleRemarksChange = e => {
    const { value } = e.target;
    setInputValue(prevInput => ({
      ...prevInput,
      remarks: value,
    }));
  };

  // Clear input
  const clearInput = () => {
    setInputValue({ name: '', email: '', remarks: '' });
    setSuggestions([]);
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!inputValue.name) {
      toast.error('Please enter a name.');
      return;
    }

    const selectedUser = emailList.find(item => item.name === inputValue.name);
    if (!selectedUser) {
      toast.error('Selected name is not valid.');
      return;
    }

    // Set the action based on `billingProgressStatus`
    const action =
      selectedInvoice?.quoteStatus === 'BillingPending' &&
      (selectedInvoice?.billingProgressStatus ===
        'PendingforInvoiceAllocation' ||
        selectedInvoice?.billingProgressStatus === 'InvoicingInProgress')
        ? 'AllocationforInvoice'
        : selectedInvoice?.billingProgressStatus ===
          'PendingForQuotationAllocation'
        ? 'AllocationforQuotation'
        : selectedInvoice?.billingProgressStatus === 'QuotationInProgress'
        ? 'ReallocationforQuotation'
        : 'ReallocationforInvoice';

    try {
      const response = await postToInstance1('/api/user/v1/allocate', {
        serviceRequestId: selectedInvoice?.serviceRequestId,
        email: inputValue.email,
        name: inputValue.name,
        remarks: inputValue.remarks,
        action: action, // Use the dynamic action here
      });

      if (response.status === 200) {
        toast.success(response?.data?.message);
        fetchInvoices();
        setInputValue({ name: '', email: '', remarks: '' });
        closeSidebar();
      } else {
        toast.error('Failed to assign email.');
      }
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error);
      toast.error(`Error assigning email: ${error.message}`);
    }
  };

  const handleDownloadZip = async (fileNames, srID) => {
    const zip = new JSZip();
    const baseUrl = 'http://localhost:5000/uploads/';

    // Fetch each file and add it to the zip
    const fetchFilePromises = fileNames.map(async fileName => {
      const fileUrl = `${baseUrl}${fileName}`;
      console.log('Fetching file:', fileUrl);

      try {
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${fileName}`);
        }
        const blob = await response.blob();
        zip.file(fileName, blob);
      } catch (error) {
        console.error(`Error fetching file ${fileName}:`, error);
      }
    });
    // Wait for all files to be fetched and added to the zip
    await Promise.all(fetchFilePromises);
    zip.generateAsync({ type: 'blob' }).then(content => {
      const fileName = `${srID}.zip`; // Fallback to 'default.zip' if no ID
      saveAs(content, fileName);
      console.log('🚀 ~ zip.generateAsync ~ fileName:', fileName);
    });
  };

  return (
    <div className="w-full py-1 px-2  bg-white dark:bg-gray-800 border-1 rounded-md ">
      <div className="my-1 mb-2 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search..."
          className="w-[50%] border bg-gray-50 dark:bg-gray-800 dark:text-brandYellow text-gray-900 border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:border-brandYellow"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className=" w-[100%] overflow-x-scroll custom-scrollbar">
        <table className="w-full  bg-brandYellow  select-none text-sm">
          <thead>
            <tr>
              {tableHeaders.map(({ label, key }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`p-2 text-left font-medium text-gray-700 cursor-pointer whitespace-nowrap hover:border-r-2 hover:border-l-2 hover:border-gray-100`}
                >
                  {label}
                  {sortConfig.key === key
                    ? sortConfig.direction === 'asc'
                      ? ' ▲'
                      : ' ▼'
                    : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=" bg-white dark:bg-gray-800   text-gray-900 dark:text-gray-100">
            {paginatedInvoices.map((invoice, index) => {
              return (
                <tr
                  key={index}
                  className=" dark:hover:bg-gray-700 even:bg-gray-50 dark:even:bg-gray-700 hover:bg-gray-200"
                >
                  <td
                    onClick={() => openModal(invoice)}
                    className="p-2 text-blue-500 hover:underline"
                  >
                    {invoice.serviceRequestId}
                  </td>
                  <td className="p-2">{invoice.quotationNo}</td>
                  <td className="p-2">
                    {invoice.quoteStatus?.substring(0, 10)}..
                  </td>
                  <td className="p-2">
                    {invoice.billingProgressStatus?.substring(0, 10)}..
                  </td>
                  <td className="p-2">{invoice.remarks?.substring(0, 8)}..</td>
                  <td className="p-2">{invoice.zone}</td>
                  <td className="p-2">{invoice.equipmentSerialNo}</td>
                  <td className="p-2">{invoice.modelNo}</td>
                  <td className="p-2">{invoice.industryDiv}</td>
                  <td className="p-2">{invoice.billingPlant}</td>
                  <td className="p-2">{invoice.customerName}</td>
                  <td className="p-2 relative">
                    <button
                      onClick={() =>
                        handleDownloadZip(
                          invoice.files,
                          invoice.serviceRequestId
                        )
                      }
                      className="relative group"
                    >
                      <MdFolderZip className="text-xl cursor-pointer" />
                      <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-11 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Attachments
                      </span>
                    </button>
                  </td>

                  <td className="p-2">
                    <button>
                      <span className="flex gap-2">
                        <span className="relative group">
                          <MdPreview
                            onClick={() => openModal(invoice)}
                            className="text-xl cursor-pointer"
                          />
                          <span className="absolute z-50  left-1/2 transform -translate-x-1/2 -translate-y-11 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            View Details
                          </span>
                        </span>
                        <span className="relative group">
                          <MdAssignmentAdd
                            onClick={() => openRightSidebar(invoice)}
                            className="text-xl cursor-pointer"
                          />
                          <span className="absolute  z-50 left-1/2 transform -translate-x-1/2 -translate-y-11 w-max px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Allocate
                          </span>
                        </span>
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 bg-brandYellow text-white rounded-sm text-sm disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-gray-700 dark:text-gray-100">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-2 py-1 bg-brandYellow text-white rounded-sm text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {/* Modal to show invoice details */}
      {showModal && (
        <div className="fixed inset-0  bg-opacity-60 backdrop-blur-sm flex justify-center items-center  z-50">
          <div className="relative  bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300  rounded-lg   h-[95vh] overflow-y-scroll custom-scrollbar shadow-lg border border-gray-300 dark:border-gray-700">
            <button
              onClick={closeModal}
              className="absolute cursor-pointer top-4 right-4 text-gray-500 hover:text-gray-800 z-50 dark:text-gray-200 dark:hover:text-gray-100"
            >
              <FaTimes className="text-2xl font-thin" />
            </button>

            <ServiceRequestDetails selectedInvoice={selectedInvoice} />
          </div>
        </div>
      )}

      {/* Right Sidebar */}
      <div>
        {showSidebar && (
          <SideBar
            closeSidebar={closeSidebar}
            handleInputChange={handleInputChange}
            handleRemarksChange={handleRemarksChange}
            selectedInvoice={selectedInvoice}
            suggestions={suggestions}
            handleSubmit={handleSubmit}
            handleSuggestionClick={handleSuggestionClick}
            inputValue={inputValue}
            clearInput={clearInput}
          />
        )}
      </div>
    </div>
  );
};

export default StatusDataPage;
