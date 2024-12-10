import React, { useState, useEffect } from 'react';
import { getFromInstance1 } from '../services/ApiEndpoint';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { toast } from 'react-hot-toast';

const StatusChart = () => {
  const [invoices, setInvoices] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeDataType, setActiveDataType] = useState('billingProgressStatus');

  const COLORS = ['#5C6BC0', '#6D4C41', '#8D6E63', '#607D8B', '#90A4AE']; // Soft and professional colors

  const fetchInvoices = async () => {
    try {
      const response = await getFromInstance1('/api/v1/all_display-report');
      if (response.status === 200) {
        const fetchedInvoices = response.data.serviceRequests || [];
        setInvoices(fetchedInvoices);
        calculateStatusCounts(fetchedInvoices, 'billingProgressStatus'); // Default initial data type
      } else {
        toast.error('Failed to fetch invoices.');
      }
    } catch (error) {
      toast.error(`Error fetching invoices: ${error.message}`);
    }
  };

  const calculateStatusCounts = (invoices, dataType) => {
    const counts = {};
    invoices.forEach(invoice => {
      const field = invoice[dataType];
      if (field) {
        counts[field] = (counts[field] || 0) + 1;
      }
    });
    setChartData(
      Object.entries(counts).map(([name, value]) => ({
        name,
        value,
      }))
    );
  };

  const handleCheckboxChange = e => {
    const { name } = e.target;
    setActiveDataType(name);
    calculateStatusCounts(invoices, name);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex flex-col py-4">
      {/* Checkbox Section */}
      <div className="flex flex-wrap justify-center mb-4">
        {['billingProgressStatus', 'quoteStatus', 'zone', 'industryDiv'].map(
          type => (
            <label
              key={type}
              className="mr-4 mb-2 text-gray-800 dark:text-gray-300"
            >
              <input
                type="checkbox"
                name={type}
                checked={activeDataType === type}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              {type}
            </label>
          )
        )}
      </div>

      {/* Charts Section */}
      <div className="flex justify-between flex-col dark:text-gray-300 text-gray-800 md:flex-row">
        {/* Bar Chart */}
        <div className="flex flex-col w-full lg:w-1/2 mb-8 lg:mr-8">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
            Bar Chart for {activeDataType}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barCategoryGap={5}>
              <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
              <YAxis tick={{ fill: '#4B5563' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: '#333' }}
                wrapperStyle={{ borderRadius: '4px' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="value" fill="#5C6BC0" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="flex flex-col w-full lg:w-1/2">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-100">
            Pie Chart for {activeDataType}
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius="70%"
                fill="#8884d8"
                dataKey="value"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  padding: '8px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                }}
                itemStyle={{ color: '#333' }}
                wrapperStyle={{ borderRadius: '4px' }}
              />
              <Legend verticalAlign="top" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatusChart;
