const EventParticipants = ({ participants = [], onCheckIn, onComplete, actionLoading, loading = false }) => (
  <div className="card">
    <div className="card-header">
      <h3>Участники ({participants.length})</h3>
    </div>
    <div className="card-body">
      {loading && <p>Загрузка списка участников...</p>}
      {!loading && participants.length === 0 && <p>Пока никто не записался.</p>}
      <ul className="participants-list">
        {!loading &&
          participants.map((participant) => (
            <li key={participant.id}>
              <div>
                <p className="participant-name">{participant.name}</p>
                <p className="participant-meta">{participant.phone}</p>
              </div>
              <div className="participant-actions">
                <button
                  type="button"
                  className="ghost-btn"
                  disabled={actionLoading?.id === participant.id && actionLoading?.type === 'check-in'}
                  onClick={() => onCheckIn?.(participant)}
                >
                  Чек-ин
                </button>
                <button
                  type="button"
                  className="ghost-btn"
                  disabled={actionLoading?.id === participant.id && actionLoading?.type === 'complete'}
                  onClick={() => onComplete?.(participant)}
                >
                  Завершить
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  </div>
);

export default EventParticipants;
