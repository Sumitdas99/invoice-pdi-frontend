import React, { useEffect } from "react";
import DataTable from "../components/DataTable";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { fetchPdiData } from "../features/pdiSlice";

const PDI_Call = () => {
  const dispatch = useDispatch();
  const { pdiData } = useSelector((state) => state.pdi);

  useEffect(() => {
    dispatch(fetchPdiData());
  }, []);

  return (
    <div className="p-4">
      <DataTable pdiData={pdiData} />
    </div>
  );
};

export default PDI_Call;
