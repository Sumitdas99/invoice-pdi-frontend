import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Manager from '../pages/Manager';

const ManagerLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user || user.role[0] !== 'billingManager') {
      navigate('/login');
    }
  }, [navigate, user]);

  return <Dashboard />;
};

export default ManagerLayout;
