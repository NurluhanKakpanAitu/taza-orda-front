import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCards from '../../components/events/EventCards';
import { fetchPublicEvents } from '../../api/dataService';

const PublicEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const response = await fetchPublicEvents({ activeOnly: true });
        setEvents(response?.events ?? response ?? []);
      } catch (error) {
        console.error('Не удалось загрузить события', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleSelectEvent = (event) => {
    if (event?.id) {
      navigate(`/events/${event.id}`);
    }
  };

  return (
    <div className="public-events">
      <h1>Городские акции</h1>
      <p className="public-events__subtitle">Выбирайте ближайшее событие и присоединяйтесь к команде чистоты города.</p>
      {loading ? <p>Загрузка...</p> : <EventCards events={events} onSelect={handleSelectEvent} />}
    </div>
  );
};

export default PublicEventsPage;
