import Button from '../Button';

const formatDateTime = (value) => {
  if (!value) {
    return 'Дата уточняется';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Дата уточняется';
  }
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const EventHighlightBanner = ({ event, onCreateNew, onEdit }) => {
  if (!event) {
    return (
      <div className="event-highlight card">
        <div className="event-highlight__content">
          <p className="event-highlight__eyebrow">Нет активных событий</p>
          <h2>Добавьте первое событие</h2>
          <p className="event-highlight__text">
            Вовлекайте жителей в уборку города. Укажите район, точку на карте и расскажите жителям, что их ждет.
          </p>
          <div className="event-highlight__actions">
            <Button type="button" onClick={onCreateNew}>
              Создать событие
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="event-highlight card">
      <div className="event-highlight__content">
        <p className="event-highlight__eyebrow">Ближайшее событие</p>
        <h2>{event.title}</h2>
        <p className="event-highlight__text">{event.description}</p>
        <dl className="event-highlight__stats">
          <div>
            <dt>Начало</dt>
            <dd>{formatDateTime(event.startAt)}</dd>
          </div>
          <div>
            <dt>Окончание</dt>
            <dd>{event.endAt ? formatDateTime(event.endAt) : '—'}</dd>
          </div>
          <div>
            <dt>Район</dt>
            <dd>{event.districtName || 'Не указан'}</dd>
          </div>
          <div>
            <dt>Награда</dt>
            <dd>{event.coinReward ? `${event.coinReward} эко монет` : 'Без награды'}</dd>
          </div>
          <div>
            <dt>Участников</dt>
            <dd>{event.participantsCount ?? 0}</dd>
          </div>
        </dl>
        <div className="event-highlight__actions">
          <Button type="button" className="ghost-btn" onClick={onCreateNew}>
            Новое событие
          </Button>
          <Button type="button" onClick={() => onEdit?.(event)}>
            Редактировать
          </Button>
        </div>
      </div>
      <div className="event-highlight__cover">
        {event.coverUrl ? (
          <img src={event.coverUrl} alt={event.title} />
        ) : (
          <div className="event-highlight__cover-placeholder">
            <p>Загрузите обложку события для наглядности.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventHighlightBanner;
