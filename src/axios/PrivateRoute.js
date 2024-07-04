import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PrivateRoute = (props) => {
  const token = localStorage.getItem('jwt');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.info('Bạn phải đăng nhập');
      navigate('/login');
    }
  }, [token, navigate]);

  if (!token) {
    return null; // or <></> to render nothing
  }

  return (<>{props.children}</>);
};

export default PrivateRoute;
