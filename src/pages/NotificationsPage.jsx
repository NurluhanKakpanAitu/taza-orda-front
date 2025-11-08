import { useEffect, useState } from 'react';
import NotificationsPanel from '../components/NotificationsPanel';
import { fetchNotifications } from '../api/dataService';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchNotifications();
        setNotifications(response?.notifications ?? response ?? []);
      } catch (err) {
        setError('Не удалось загрузить уведомления.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Уведомления</h2>
          <p>Сервис информирует о статусе обращений и акциях.</p>
        </div>
      </div>
      {loading && <p>Загрузка...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && <NotificationsPanel notifications={notifications} />}
    </div>
  );
};

export default NotificationsPage;
