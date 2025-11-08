import { useEffect, useState } from 'react';
import EventsList from '../components/EventsList';
import { fetchEvents } from '../api/dataService';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetchEvents();
        setEvents(response?.events ?? response ?? []);
      } catch (err) {
        setError('Не удалось загрузить акции.');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleJoin = (event) => {
    alert(`Вы присоединились к акции "${event.title}"`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Акции и мероприятия</h2>
          <p>Участвуйте в субботниках и городских инициативах.</p>
        </div>
      </div>
      {loading && <p>Загрузка...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && <EventsList events={events} onJoin={handleJoin} />}
    </div>
  );
};

export default EventsPage;
