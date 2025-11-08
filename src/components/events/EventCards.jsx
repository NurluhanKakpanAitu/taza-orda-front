const formatRange = (startAt, endAt) => {
  const start = startAt ? new Date(startAt) : null;
  const end = endAt ? new Date(endAt) : null;

  if (!start || Number.isNaN(start.getTime())) {
    return 'Дата уточняется';
  }

  const formattedStart = start.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });

  if (!end || Number.isNaN(end.getTime())) {
    return formattedStart;
  }

  return `${formattedStart} — ${end.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const EventCards = ({ events = [], onSelect }) => {
  if (!events.length) {
    return <p className="muted-text">Пока нет активных событий.</p>;
  }

  return (
    <div className="event-card-grid">
      {events.map((event) => (
        <article className="event-card" key={event.id}>
          <div className="event-card__cover">
            {event.coverUrl ? (
              <img src={event.coverUrl} alt={event.title} />
            ) : (
              <div className="event-card__cover--empty">
                <p>Загрузите обложку, чтобы событие выделялось.</p>
              </div>
            )}
          </div>
          <div className="event-card__body">
            <p className="event-card__time">{formatRange(event.startAt, event.endAt)}</p>
            <h3>{event.title}</h3>
            <p className="event-card__description">{event.description || 'Описание появится позже.'}</p>
            <div className="event-card__meta">
              <span>{event.districtName || 'Район уточняется'}</span>
              <span>{event.participantsCount ?? 0} участ.</span>
            </div>
            <p className="event-card__reward">{event.coinReward ? `${event.coinReward} эко монет` : 'Без награды'}</p>
            <button type="button" className="ghost-btn" onClick={() => onSelect?.(event)}>
              Подробнее
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default EventCards;
