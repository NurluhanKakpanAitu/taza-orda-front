const DistrictStatsPanel = ({ stats = [] }) => (
  <div className="card">
    <div className="card-header">
      <h3>Статистика районов</h3>
    </div>
    <div className="card-body">
      {stats.length === 0 && <p>Нет данных по районам.</p>}
      <div className="district-stats-grid">
        {stats.map((item) => (
          <div className="district-stat-card" key={item.districtId}>
            <p className="district-name">{item.districtName}</p>
            <div className="district-stat-row">
              <span>Всего</span>
              <strong>{item.reportsTotal ?? 0}</strong>
            </div>
            <div className="district-stat-row">
              <span>Новые</span>
              <strong>{item.reportsNew ?? 0}</strong>
            </div>
            <div className="district-stat-row">
              <span>В работе</span>
              <strong>{item.reportsInProgress ?? 0}</strong>
            </div>
            <div className="district-stat-row">
              <span>Активные</span>
              <strong>{item.reportsActive ?? 0}</strong>
            </div>
            <div className="district-stat-row">
              <span>Выполнено</span>
              <strong>{item.reportsDone ?? 0}</strong>
            </div>
            <div className="district-stat-row">
              <span>Контейнеры</span>
              <strong>{item.containersCount ?? 0}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DistrictStatsPanel;
