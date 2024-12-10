import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const PublicLayout = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role) {
      if (user.role.includes('admin')) {
        navigate('/admin');
      } else if (user.role.includes('billingManager')) {
        navigate('/billingManager');
      } else if (user.role.includes('billingAgent')) {
        navigate('/billingAgent');
      } else if (user.role.includes('manager')) {
        navigate('/manager');
      } else if (user.role.includes('inspector')) {
        navigate('/inspector');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  return <Outlet />;
};

export default PublicLayout;
