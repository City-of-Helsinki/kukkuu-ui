import React from 'react';
import { useNavigate } from 'react-router-dom';

const SilentRenewRedirect = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate('/silent_renew.html', { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

export default SilentRenewRedirect;
