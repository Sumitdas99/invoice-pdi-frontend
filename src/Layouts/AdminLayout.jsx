import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user || !user.role.includes('admin')) {
      navigate('/login');
    }
  }, [navigate, user]);

  return <Dashboard />;
};

export default AdminLayout;
