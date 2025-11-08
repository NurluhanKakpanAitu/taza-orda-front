import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { fetchCoinsHistory } from '../api/dataService';

const ProfilePage = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchCoinsHistory();
        setHistory(response?.history ?? response ?? []);
      } catch (err) {
        setError('Не удалось загрузить историю эко монет.');
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Профиль</h2>
          <p>Личная информация и история эко монет.</p>
        </div>
      </div>
      <div className="card profile-card">
        <div className="card-body">
          <p>
            <strong>Имя:</strong> {user?.name }
          </p>
          <p>
            <strong>Телефон:</strong> {user?.phoneNumber ?? '7...'}
          </p>
          <p>
            <strong>Email:</strong> {user?.email ?? 'не указан'}
          </p>
          <p>
            <strong>Баланс эко монет:</strong> {user?.coinBalance ?? user?.coins ?? 0}
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>История эко монет</h3>
        </div>
        <div className="card-body coin-history">
          {error && <p className="error-text">{error}</p>}
          {!error && history.length === 0 && <p>История начисления эко монет пока пуста.</p>}
          <ul>
            {history.map((item) => (
              <li key={item.id}>
                <div>
                  <p className="coin-title">{item.title}</p>
                  <p className="coin-meta">{item.date}</p>
                </div>
                <span className={`coin-amount ${item.amount > 0 ? 'positive' : 'negative'}`}>
                  {item.amount > 0 ? '+' : ''}
                  {item.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
