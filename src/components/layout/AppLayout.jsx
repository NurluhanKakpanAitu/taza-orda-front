import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => (
  <div className="app-shell">
    <Sidebar />
    <div className="app-shell__content">
      <Header />
      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
