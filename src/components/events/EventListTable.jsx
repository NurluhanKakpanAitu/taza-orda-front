const statusFilters = [
  { value: 'active', label: 'Активные' },
  { value: 'past', label: 'Прошедшие' },
];

const EventListTable = ({
  events = [],
  filters = { status: 'active', districtId: '' },
  districts = [],
  onFilterChange,
  onSelectEvent,
  emptyLabel = 'События не найдены',
}) => (
  <div className="card">
    <div className="card-header">
      <h3>События</h3>
      <div className="event-filters">
        <select value={filters.status ?? 'active'} onChange={(e) => onFilterChange?.('status', e.target.value)}>
          {statusFilters.map((filter) => (
            <option value={filter.value} key={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
        <select value={filters.districtId ?? ''} onChange={(e) => onFilterChange?.('districtId', e.target.value)}>
          <option value="">Все районы</option>
          {districts.map((district) => (
            <option value={district.id} key={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Название</th>
            <th>Район</th>
            <th>Награда</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 && (
            <tr>
              <td colSpan={5} className="table-empty">
                {emptyLabel}
              </td>
            </tr>
          )}
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.startAt ? new Date(event.startAt).toLocaleDateString() : '—'}</td>
              <td>{event.title}</td>
              <td>{event.districtName || '—'}</td>
              <td>{event.coinReward ? `${event.coinReward} эко монет` : '—'}</td>
              <td>
                <button type="button" className="ghost-btn" onClick={() => onSelectEvent?.(event)}>
                  Подробнее
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EventListTable;
