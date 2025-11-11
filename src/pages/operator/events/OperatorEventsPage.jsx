import { useCallback, useEffect, useMemo, useState } from 'react';
import EventForm from '../../../components/events/EventForm';
import EventListTable from '../../../components/events/EventListTable';
import EventMapPins from '../../../components/events/EventMapPins';
import EventParticipants from '../../../components/events/EventParticipants';
import EventHighlightBanner from '../../../components/events/EventHighlightBanner';
import {
  fetchOperatorEvents,
  fetchEventParticipants,
  createEvent,
  updateEvent,
  fetchDistricts,
  checkInEventParticipant,
  completeEventParticipant,
} from '../../../api/dataService';
import { uploadEventCover } from '../../../api/reportService';

const resolveCoverUrl = (response) =>
  response?.url ??
  response?.fileUrl ??
  response?.photoUrl ??
  response?.data?.url ??
  response?.data?.fileUrl ??
  response?.data?.photoUrl ??
  null;

const OperatorEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formValues, setFormValues] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [filters, setFilters] = useState({ status: 'active', districtId: '' });
  const [eventsLoading, setEventsLoading] = useState(false);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [participantAction, setParticipantAction] = useState(null);
  const [savingEvent, setSavingEvent] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);

  const buildFilterParams = useCallback(() => {
    const params = {};
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.districtId) {
      params.districtId = filters.districtId;
    }
    return params;
  }, [filters]);

  const loadEvents = useCallback(async () => {
    setEventsLoading(true);
    try {
      const response = await fetchOperatorEvents(buildFilterParams());
      const list = response?.events ?? response ?? [];
      setEvents(list);
      return list;
    } catch (error) {
      console.error('Не удалось загрузить события оператора', error);
      return [];
    } finally {
      setEventsLoading(false);
    }
  }, [buildFilterParams]);

  const loadParticipants = useCallback(async (eventId) => {
    if (!eventId) {
      setParticipants([]);
      return;
    }
    setParticipantsLoading(true);
    try {
      const response = await fetchEventParticipants(eventId);
      setParticipants(response?.participants ?? response ?? []);
    } catch (error) {
      console.error('Не удалось получить участников события', error);
      setParticipants([]);
    } finally {
      setParticipantsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const response = await fetchDistricts();
        const list = response?.districts ?? response ?? [];
        setDistricts(list);
      } catch (error) {
        console.error('Не удалось загрузить районы', error);
      }
    };

    loadDistricts();
  }, []);

  const handleSelectEvent = useCallback(
    async (event) => {
      if (!event) {
        setSelectedEvent(null);
        setFormValues(null);
        setParticipants([]);
        return;
      }
      setCreatingNew(false);
      setSelectedEvent(event);
      setFormValues(event);
      await loadParticipants(event.id);
    },
    [loadParticipants],
  );

  useEffect(() => {
    if (!events.length) {
      setSelectedEvent(null);
      setParticipants([]);
      return;
    }

    if (selectedEvent) {
      const actual = events.find((event) => event.id === selectedEvent.id);
      if (actual) {
        setSelectedEvent(actual);
        if (formValues?.id === actual.id) {
          setFormValues(actual);
        }
        return;
      }
    }

    if (!creatingNew) {
      handleSelectEvent(events[0]);
    }
  }, [events, selectedEvent, formValues, handleSelectEvent, creatingNew]);

  const handleSubmitEvent = async (values) => {
    setSavingEvent(true);
    try {
      const isEditing = Boolean(values.id);
      const response = isEditing ? await updateEvent(values.id, values) : await createEvent(values);
      const list = await loadEvents();
      const savedEventId =
        values.id ?? response?.event?.id ?? response?.id ?? (response?.data ? response.data.id : undefined);
      if (savedEventId) {
        const nextSelected = list.find((event) => event.id === savedEventId) ?? null;
        if (nextSelected) {
          await handleSelectEvent(nextSelected);
          return;
        }
      }
      if (!isEditing && list.length) {
        await handleSelectEvent(list[0]);
      }
    } catch (error) {
      console.error('Не удалось сохранить событие', error);
    } finally {
      setSavingEvent(false);
      setCreatingNew(false);
    }
  };

  const handleUploadCover = async (file) => {
    if (!file) {
      return null;
    }
    try {
      const response = await uploadEventCover(file);
      const fileUrl = resolveCoverUrl(response);
      if (fileUrl) {
        setFormValues((prev) => (prev ? { ...prev, coverUrl: fileUrl } : prev));
        setSelectedEvent((prev) => (prev ? { ...prev, coverUrl: fileUrl } : prev));
      }
      return fileUrl;
    } catch (error) {
      console.error('Не удалось загрузить обложку события', error);
      return null;
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleParticipantAction = async (participant, type) => {
    if (!selectedEvent || !participant?.id) {
      return;
    }
    setParticipantAction({ type, id: participant.id });
    try {
      if (type === 'check-in') {
        await checkInEventParticipant(selectedEvent.id, participant.id);
      } else {
        await completeEventParticipant(selectedEvent.id, participant.id);
      }
      await loadParticipants(selectedEvent.id);
    } catch (error) {
      console.error('Не удалось обновить статус участника', error);
    } finally {
      setParticipantAction(null);
    }
  };

  const highlightEvent = useMemo(() => selectedEvent ?? events[0] ?? null, [selectedEvent, events]);

  const handleCreateNew = () => {
    setCreatingNew(true);
    setFormValues(null);
    setSelectedEvent(null);
    setParticipants([]);
  };

  return (
    <div className="operator-dashboard">
      <h1>События оператора</h1>
      <EventHighlightBanner event={highlightEvent} onCreateNew={handleCreateNew} onEdit={handleSelectEvent} />
      <EventForm
        initialValues={formValues}
        districts={districts}
        onSubmit={handleSubmitEvent}
        onUploadCover={handleUploadCover}
        submitting={savingEvent}
      />
      <EventMapPins events={events} onSelect={handleSelectEvent} />
      <EventListTable
        events={events}
        filters={filters}
        districts={districts}
        onFilterChange={handleFilterChange}
        onSelectEvent={handleSelectEvent}
      />
      <EventParticipants
        participants={participants}
        loading={participantsLoading}
        actionLoading={participantAction}
        onCheckIn={(participant) => handleParticipantAction(participant, 'check-in')}
        onComplete={(participant) => handleParticipantAction(participant, 'complete')}
      />
      {eventsLoading && <p>Обновляем список событий...</p>}
    </div>
  );
};

export default OperatorEventsPage;
