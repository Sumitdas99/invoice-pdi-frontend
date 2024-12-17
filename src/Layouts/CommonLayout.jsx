import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

const CommonLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (
      !user ||
      !user.role ||
      (!user.role.includes('salesUser') &&
        !user.role.includes('admin') &&
        !user.role.includes('billingManager') &&
        !user.role.includes('billingAgent'))
    ) {
      navigate('/login');
    }
  }, [navigate, user]);

  return <Dashboard />;
};

export default CommonLayout;
