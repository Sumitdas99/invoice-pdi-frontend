import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

const UserLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user || !user.role.includes('salesUser')) {
      navigate('/login');
    }
  }, [user, navigate]);

  return <Dashboard />;
};

export default UserLayout;
