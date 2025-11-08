const NotificationsPanel = ({ notifications = [] }) => (
  <div className="card">
    <div className="card-header">
      <h3>Уведомления</h3>
    </div>
    <div className="card-body notifications-list">
      {notifications.length === 0 && <p>Новых уведомлений нет.</p>}
      {notifications.map((item) => (
        <div className="notification-item" key={item.id}>
          <p className="notification-title">{item.title}</p>
          <p className="notification-meta">{item.message}</p>
          <span className="notification-date">{item.date}</span>
        </div>
      ))}
    </div>
  </div>
);

export default NotificationsPanel;
