import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MyReports from '../components/MyReports';
import useAuth from '../hooks/useAuth';
import { fetchUserReports } from '../api/dataService';

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      if (!user?.id) {
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await fetchUserReports(user.id);
        setReports(response?.reports ?? response ?? []);
      } catch (err) {
        setError('Не удалось загрузить обращения.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Мои обращения</h2>
          <p>Отслеживайте статус обращений и просматривайте детали выполнения.</p>
        </div>
        <Link to="/create" className="primary-btn">
          Новое обращение
        </Link>
      </div>
      {loading && <p>Загрузка...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && <MyReports reports={reports} />}
    </div>
  );
};

export default ReportsPage;
