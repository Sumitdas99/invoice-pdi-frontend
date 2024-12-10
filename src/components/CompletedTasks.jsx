import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { getFromInstance1 } from '../services/ApiEndpoint';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaFilePdf } from 'react-icons/fa'; // Import PDF icon from react-icons

const CompletedTasks = () => {
  const { user } = useSelector(state => state.auth);
  const [invoices, setInvoices] = useState([]);
  console.log('🚀 ~ CompletedTasks ~ invoices:', invoices);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 12;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getFromInstance1(
          '/api/v1/display-report/status'
        );
        if (response.status === 200) {
          setInvoices(
            response.data?.serviceRequests.filter(
              item => item.srStatus === 'Closed'
            )
          );
        } else {
          toast.error('Failed to fetch invoices.');
        }
      } catch (error) {
        toast.error(`Error fetching invoices: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedInvoices = React.useMemo(() => {
    let sortableInvoices = [...(invoices || [])];
    if (sortConfig.key !== null) {
      sortableInvoices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableInvoices;
  }, [invoices, sortConfig]);

  const filteredInvoices = sortedInvoices.filter(invoice =>
    Object.values(invoice).some(val =>
      val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  return (
    <div className="py-1 px-2 bg-gray-100 dark:bg-gray-800 border-1 rounded-lg min-h-screen">
      <div className="my-2 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search..."
          className="w-[50%] border bg-gray-50 dark:bg-gray-800 dark:text-brandYellow text-gray-900 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-brandYellow"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-700">Loading invoices...</p>
        ) : (
          <table className="w-full overflow-hidden bg-brandYellow select-none text-sm">
            <thead>
              <tr>
                {[
                  'SrId',
                  'quoteNo',
                  'zone',
                  'equipSNo',
                  'modelNo',
                  'indDiv',
                  'billingPlant',
                  'customerName',
                  'SrStatus',
                  'QuoteStatus',
                  'attachments',
                ].map(key => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="p-2 text-left font-medium text-gray-700 cursor-pointer hover:border-r-2 hover:border-l-2 hover:border-gray-100"
                  >
                    {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    {sortConfig.key === key
                      ? sortConfig.direction === 'asc'
                        ? ' ▲'
                        : ' ▼'
                      : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-gray-50 dark:bg-gray-800 dark:text-brandYellow text-gray-900">
              {paginatedInvoices.map((invoice, index) => {
                const file = invoice?.files?.[0]; // Access the first file in the files array
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                const isPDF = /\.pdf$/i.test(file);

                return (
                  <tr
                    key={index}
                    className="border dark:hover:bg-gray-700 hover:bg-gray-200"
                  >
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      <Link
                        to={`/service-requests/${user?.role}/${invoice.serviceRequestId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {invoice.serviceRequestId}
                      </Link>
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.quotationNo}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.zone}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.equipmentSerialNo}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.modelNo}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.industryDiv}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.billingPlant}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.customerName}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.srStatus}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {invoice.quoteStatus}
                    </td>
                    <td className="p-2 text-gray-700 dark:text-gray-100">
                      {isImage ? (
                        <div className="flex items-center space-x-2">
                          <a
                            href={`${backendUrl}/uploads/${file}`}
                            download
                            target="new"
                            className="flex items-center space-x-2"
                          >
                            <img
                              src={`${backendUrl}/uploads/${file}`}
                              alt="Preview"
                              className="w-6 h-6 object-cover rounded-md"
                            />
                            <span>IMG file</span>
                          </a>
                        </div>
                      ) : isPDF ? (
                        <a
                          href={`${backendUrl}/uploads/${file}`}
                          download
                          target="new"
                          className="flex items-center space-x-2"
                        >
                          <FaFilePdf className="text-red-500 text-2xl" />
                          <span>PDF File</span>
                        </a>
                      ) : (
                        <span>Unsupported file type</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-brandYellow text-white rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-gray-700 dark:text-gray-100">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-brandYellow text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CompletedTasks;
