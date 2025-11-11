import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import {
  cancelEventParticipation,
  fetchEventDetails,
  fetchPublicEventParticipants,
  joinEvent,
} from '../../api/dataService';

const toCoord = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const { user } = useAuth();
  const isResident = user ? ['Resident', undefined, null, ''].includes(user.role) : false;

  const loadDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchEventDetails(id);
      setEventDetails(response?.event ?? response ?? null);
      setError('');
    } catch (err) {
      console.error('Не удалось загрузить событие', err);
      setError(err?.response?.data?.message ?? 'Не удалось загрузить событие');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const loadParticipants = useCallback(async () => {
    if (!id) {
      setParticipants([]);
      return;
    }
    setParticipantsLoading(true);
    try {
      const response = await fetchPublicEventParticipants(id);
      const list = response?.participants ?? response ?? [];
      setParticipants(list);
    } catch (err) {
      console.error('Не удалось загрузить участников события', err);
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const handleJoin = async () => {
    if (!eventDetails) return;
    setActionLoading(true);
    setError('');
    try {
      await joinEvent(eventDetails.id);
      await Promise.all([loadDetails(), loadParticipants()]);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Не удалось присоединиться к событию');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!eventDetails) return;
    setActionLoading(true);
    setError('');
    try {
      await cancelEventParticipation(eventDetails.id);
      await Promise.all([loadDetails(), loadParticipants()]);
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Не удалось отменить участие');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!eventDetails) {
    return <p className="error-text">{error || 'Событие не найдено'}</p>;
  }

  const lat = toCoord(eventDetails.latitude);
  const lng = toCoord(eventDetails.longitude);
  const hasCoordinates = lat !== null && lng !== null;
  const canJoin = isResident && eventDetails.isActive && !eventDetails.hasEnded && !eventDetails.isUserJoined;
  const canCancel =
    isResident &&
    eventDetails.isUserJoined &&
    !['Completed', 'Cancelled'].includes(eventDetails.userParticipantStatus ?? '');
  const statusLabels = {
    Joined: 'Вы записаны на событие',
    CheckedIn: 'Вы отметились на событии',
    Completed: 'Вы успешно завершили участие',
    Cancelled: 'Вы отменили участие',
  };

  return (
    <div className="event-details-page">
      <section className="event-hero card">
        <div className="event-hero__cover">
          {eventDetails.coverUrl ? (
            <img src={eventDetails.coverUrl} alt={eventDetails.title} />
          ) : (
            <div className="event-hero__cover--empty">
              <p>Добавьте обложку, чтобы событие было заметнее.</p>
            </div>
          )}
        </div>
        <div className="event-hero__body">
          <p className={`event-tag ${eventDetails.isActive ? 'event-tag--active' : 'event-tag--inactive'}`}>
            {eventDetails.isActive ? 'Активное событие' : eventDetails.hasEnded ? 'Событие завершено' : 'Черновик'}
          </p>
          <h1>{eventDetails.title}</h1>
          <p className="event-hero__description">{eventDetails.description || 'Описание появится позже.'}</p>
          <div className="event-meta-grid">
            <div>
              <span>Начало</span>
              <strong>{eventDetails.startAt ? new Date(eventDetails.startAt).toLocaleString() : '—'}</strong>
            </div>
            <div>
              <span>Окончание</span>
              <strong>{eventDetails.endAt ? new Date(eventDetails.endAt).toLocaleString() : '—'}</strong>
            </div>
            <div>
              <span>Район</span>
              <strong>{eventDetails.districtName || 'Не указан'}</strong>
            </div>
            <div>
              <span>Награда</span>
              <strong>{eventDetails.coinReward ? `${eventDetails.coinReward} эко монет` : 'Без награды'}</strong>
            </div>
            <div>
              <span>Участников</span>
              <strong>{eventDetails.participantsCount ?? participants.length ?? 0}</strong>
            </div>
          </div>
          {isResident && (
            <div className="event-actions">
              {canJoin && (
                <Button type="button" onClick={handleJoin} loading={actionLoading}>
                  Присоединиться
                </Button>
              )}
              {canCancel && (
                <button type="button" className="ghost-btn" onClick={handleCancel} disabled={actionLoading}>
                  Отменить участие
                </button>
              )}
              {!canJoin && !canCancel && (
                <p className="muted-text">
                  {eventDetails.userParticipantStatus === 'Completed'
                    ? 'Вы завершили участие в этой акции.'
                    : eventDetails.isUserJoined
                      ? statusLabels[eventDetails.userParticipantStatus] ?? 'Вы уже присоединились.'
                      : eventDetails.hasEnded
                        ? 'Событие завершено.'
                        : 'Вы не можете присоединиться к событию.'}
                </p>
              )}
              {error && <p className="error-text">{error}</p>}
            </div>
          )}
        </div>
      </section>

      {hasCoordinates && (
        <section className="event-section card">
          <div className="card-header">
            <h3>Место проведения</h3>
          </div>
          <MapContainer center={[lat, lng]} zoom={14} scrollWheelZoom={false} className="event-map">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]} />
          </MapContainer>
        </section>
      )}

      <section className="event-section card">
        <div className="card-header">
          <h3>Участники ({participants.length})</h3>
        </div>
        {participantsLoading && <p>Загрузка списка участников...</p>}
        {!participantsLoading && participants.length === 0 && <p>Будьте первым, кто присоединится.</p>}
        {!participantsLoading && participants.length > 0 && (
          <ul className="event-participants-list">
            {participants.map((participant) => (
              <li key={participant.id || participant.userId}>
                <div>
                  <p className="participant-name">{participant.userName || 'Неизвестный участник'}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default EventDetailsPage;
