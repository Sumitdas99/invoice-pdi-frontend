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
    <main className="p-6 space-y-6">
      {/* Call Cards for displaying counts */}
      <CallCards pdiData={pdiData} piCount={piCount} pdiCount={pdiCount} />
      <div className="flex items-center gap-2">
        {/* Table for PDI Data */}
        <div>
          <h2 className="text-lg font-bold mb-4">PDI Data</h2>
          {pdiData?.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Equipment SL No</th>
                  <th className="py-2 px-4 border-b">SrNo</th>
                  <th className="py-2 px-4 border-b">Overdue Status</th>
                </tr>
              </thead>
              <tbody>
                {pdiData.map(
                  ({ equipment_sl_no, overdue_status, sr_no }, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{equipment_sl_no}</td>
                      <td className="py-2 px-4">{sr_no}</td>
                      <td className="py-2 px-4">{overdue_status}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p>No PDI data available.</p>
          )}
        </div>

        {/* Table for PI Data */}
        <div>
          <h2 className="text-lg font-bold mb-4">PI Data</h2>
          {piData?.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Equipment SL No</th>
                  <td className="py-2 px-4">SR No</td>
                  <th className="py-2 px-4 border-b">Overdue Status</th>
                </tr>
              </thead>
              <tbody>
                {piData.map(
                  ({ equipment_sl_no, overdue_status, sr_no }, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-4">{equipment_sl_no}</td>
                      <td className="py-2 px-4">{sr_no}</td>
                      <td className="py-2 px-4">{overdue_status}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          ) : (
            <p>No PI data available.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ManagerDashboardContent;
