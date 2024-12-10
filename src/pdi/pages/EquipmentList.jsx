import React from 'react';
import DataTable from '../components/DataTable';
import { useSelector } from 'react-redux';

const EquipmentList = () => {
  const { pdiData } = useSelector(state => state.pdi);

  return (
    <div className="p-4">
      <DataTable pdiData={pdiData} />
    </div>
  );
};

export default EquipmentList;
