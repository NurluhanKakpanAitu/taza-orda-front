import { Link, useNavigate } from 'react-router-dom';
import Button from '../Button';
import useAuth from '../../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const coinBalance = user?.coinBalance ?? user?.coins ?? 0;
  const isOperator = ['Operator', 'Admin'].includes(user?.role);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="app-header">
      <div className="app-header__title">
        <h1>Тазалық Қызылорда</h1>
        <p>Мониторинг чистоты города и участие жителей</p>
      </div>
      <div className="app-header__actions">
        {!isOperator && (
          <div className="balance-chip">
            <span>Баланс эко монет</span>
            <strong>{coinBalance}</strong>
          </div>
        )}
        <Link to="/notifications" className="ghost-btn">
          Уведомления
        </Link>
        {!isOperator && (
          <Button type="button" onClick={() => navigate('/dashboard?create=1')}>
            Сообщить о проблеме
          </Button>
        )}
        <button type="button" className="ghost-btn" onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </header>
  );
};

export default Header;
