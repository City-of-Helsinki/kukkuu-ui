import React from 'react';
import { useNavigate } from 'react-router';

const SilentRenewRedirect = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/silent_renew.html', { replace: true });
  }, []);
  return null;
};

export default SilentRenewRedirect;
