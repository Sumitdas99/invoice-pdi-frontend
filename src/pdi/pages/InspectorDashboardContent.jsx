import { useSelector } from 'react-redux';
import { fetchPdiData } from '../features/pdiSlice';
import { fetchPiData } from '../features/piSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { CallCards } from '../components';

const ManagerDashboardContent = () => {
  const dispatch = useDispatch();

  // Selectors for state data
  const { pdiData } = useSelector(state => state.pdi);
  const { piData } = useSelector(state => state.pi);
  const { piCount } = useSelector(state => state.pi);
  const { pdiCount } = useSelector(state => state.pdi);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchPdiData());
    dispatch(fetchPiData());
  }, [dispatch]);

  return (
    <main className="p-3 space-y-3">
      {/* Call Cards for displaying counts */}
      <CallCards pdiData={pdiData} piCount={piCount} pdiCount={pdiCount} />

      {/* Tables Section */}
      <div className="flex items-start gap-3">
        {/* Table for PDI Data */}
        <div className="flex-1">
          <h2 className="text-sm font-semibold mb-2 text-gray-600">PDI Data</h2>
          {pdiData?.length > 0 ? (
            <table className="w-full bg-white border border-gray-200 text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="py-1 px-1 border-b text-left">
                    Equipment SL No
                  </th>
                  <th className="py-1 px-1 border-b text-left">SrNo</th>
                  <th className="py-1 px-1 border-b text-left">
                    Overdue Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {pdiData.map(
                  ({ equipment_sl_no, overdue_status, sr_no }, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-1 px-1 border-b text-gray-600">
                        {equipment_sl_no}
                      </td>
                      <td className="py-1 px-1 border-b text-gray-600">
                        {sr_no}
                      </td>
                      <td className="py-1 px-1 border-b text-gray-600">
                        {overdue_status}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-gray-400">No PDI data available.</p>
          )}
        </div>

        {/* Table for PI Data */}
        <div className="flex-1">
          <h2 className="text-sm font-semibold mb-2 text-gray-600">PI Data</h2>
          {piData?.length > 0 ? (
            <table className="w-full bg-white border border-gray-200 text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="py-1 px-1 border-b text-left">
                    Equipment SL No
                  </th>
                  <th className="py-1 px-1 border-b text-left">Sr No</th>
                  <th className="py-1 px-1 border-b text-left">
                    Overdue Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {piData.map(
                  ({ equipment_sl_no, overdue_status, sr_no }, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                    >
                      <td className="py-1 px-1 border-b text-gray-600">
                        {equipment_sl_no}
                      </td>
                      <td className="py-1 px-1 border-b text-gray-600">
                        {sr_no}
                      </td>
                      <td className="py-1 px-1 border-b text-gray-600">
                        {overdue_status}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p className="text-xs text-gray-400">No PI data available.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ManagerDashboardContent;
