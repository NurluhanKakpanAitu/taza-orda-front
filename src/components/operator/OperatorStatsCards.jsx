const cards = [
  { key: 'total', label: 'Всего' },
  { key: 'new', label: 'Новые' },
  { key: 'inProgress', label: 'В работе' },
  { key: 'done', label: 'Выполнено' },
];

const OperatorStatsCards = ({ stats = {}, loading }) => (
  <div className="operator-stats">
    {cards.map((card) => (
      <div className="operator-stat-card" key={card.key}>
        <p className="stat-label">{card.label}</p>
        <p className="stat-value">{loading ? '—' : stats[card.key] ?? 0}</p>
      </div>
    ))}
  </div>
);

export default OperatorStatsCards;
