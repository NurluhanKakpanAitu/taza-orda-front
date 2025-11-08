import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateReportPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard?create=1', { replace: true });
  }, [navigate]);

  return null;
};

export default CreateReportPage;
