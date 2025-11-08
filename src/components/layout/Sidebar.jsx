import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const residentNav = [
  { to: '/dashboard', label: 'Главная' },
  { to: '/reports', label: 'Мои обращения' },
  { to: '/events', label: 'Акции' },
  { to: '/profile', label: 'Профиль' },
  { to: '/notifications', label: 'Уведомления' },
];

const operatorNav = [
  { to: '/operator/dashboard', label: 'Панель оператора' },
  { to: '/operator/events', label: 'События' },
  { to: '/operator/districts', label: 'Районы города' },
  { to: '/notifications', label: 'Уведомления' },
];

const roleLabels = {
  Resident: 'Житель города',
  Operator: 'Оператор',
  Inspector: 'Инспектор',
  Admin: 'Администратор',
};

const Sidebar = () => {
  const { user } = useAuth();
  const isOperator = ['Operator', 'Admin'].includes(user?.role);
  const navItems = isOperator ? operatorNav : residentNav;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-user">
        <div className="avatar-placeholder">{user?.firstName?.[0] ?? user?.name?.[0] ?? 'Ж'}</div>
        <div>
          <p className="sidebar-user__name">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="sidebar-user__role">{roleLabels[user?.role] ?? 'Житель города'}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
