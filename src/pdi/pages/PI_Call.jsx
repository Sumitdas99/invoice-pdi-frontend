import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPiData } from '../features/piSlice';
import { PiDataTable } from '../components';

const PI_Call = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPiData());
  }, []);

  const { piData } = useSelector(state => state.pi);

  return (
    <div className="p-4">
      <PiDataTable piData={piData} />
    </div>
  );
};

export default PI_Call;
