const EventsList = ({ events = [], onJoin }) => (
  <div className="card">
    <div className="card-header">
      <h3>Акции и новости</h3>
    </div>
    <div className="card-body events-list">
      {events.length === 0 && <p>Пока нет активных акций.</p>}
      {events.map((event) => (
        <div className="event-item" key={event.id}>
          <div>
            <p className="event-title">{event.title}</p>
            <p className="event-meta">{event.description}</p>
          </div>
          <button type="button" className="ghost-btn" onClick={() => onJoin?.(event)}>
            Присоединиться
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default EventsList;
