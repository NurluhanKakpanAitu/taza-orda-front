import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MapView from '../components/MapView';
import MyReports from '../components/MyReports';
import EventsList from '../components/EventsList';
import Button from '../components/Button';
import CreateReportModal from '../components/CreateReportModal';
import useAuth from '../hooks/useAuth';
import {
  fetchActiveReports,
  fetchEvents,
  fetchUserReports,
  fetchDistricts,
  fetchDistrictStats,
} from '../api/dataService';
import useReportCreation from '../hooks/useReportCreation';

const DEFAULT_LOCATION = null;

const DashboardPage = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { user } = useAuth();
  const [activeReports, setActiveReports] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [events, setEvents] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [districtStats, setDistrictStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(DEFAULT_LOCATION);

  const {
    categories,
    categoriesLoading,
    fetchCategories,
    submitReport,
    submitError,
    setSubmitError,
    submitting,
  } = useReportCreation();

  const coinBalance = useMemo(() => user?.coinBalance ?? user?.coins ?? 0, [user]);

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [active, mine, eventsResponse, districtsResponse, districtStatsResponse] = await Promise.all([
        fetchActiveReports(),
        fetchUserReports(user.id),
        fetchEvents(),
        fetchDistricts(),
        fetchDistrictStats(),
      ]);

      setActiveReports(active?.reports ?? active ?? []);
      setMyReports(mine?.reports ?? mine ?? []);
      setEvents(eventsResponse?.events ?? eventsResponse ?? []);
      setDistricts(districtsResponse?.districts ?? districtsResponse ?? []);
      setDistrictStats(districtStatsResponse?.stats ?? districtStatsResponse ?? []);
    } catch (err) {
      setError('Не удалось загрузить данные дашборда.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    if (['Operator', 'Admin'].includes(user?.role)) {
      navigate('/operator/dashboard', { replace: true });
      return;
    }
    if (isCreateModalOpen) {
      fetchCategories();
    }
  }, [isCreateModalOpen, fetchCategories, user, navigate]);

  const handleOpenModal = useCallback(() => {
    setSubmitError('');
    setIsCreateModalOpen(true);
  }, [setSubmitError]);

  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);
    if (params.get('create') === '1') {
      handleOpenModal();
      navigate('/dashboard', { replace: true });
    }
  }, [routerLocation.search, navigate, handleOpenModal]);

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setSubmitError('');
  };

  const handleViewReports = () => navigate('/reports');
  const handleJoinEvent = (event) => {
    // placeholder action
    alert(`Вы присоединились к акции: ${event.title}`);
  };

  const handleDistrictSelect = (coords) => {
    if (coords?.lat && coords?.lng) {
      setSelectedLocation({
        lat: coords.lat,
        lng: coords.lng,
        districtId: coords.districtId,
        districtName: coords.districtName,
      });
    }
  };

  const handleReportSubmit = async (payload, reset) => {
    try {
      const result = await submitReport({
        ...payload,
        location: selectedLocation,
      });

      if (result) {
        reset?.();
        handleCloseModal();
        alert('Обращение отправлено!');
        loadDashboardData();
      }
    } catch (err) {
      // submitReport already sets error state
    }
  };

  return (
    <div className="dashboard-grid">
      <section className="welcome-card card">
        <div>
          <p className="eyebrow-text">С возвращением</p>
          <h2>{user?.firstName || user?.name || 'житель'}!</h2>
          <p>
            Следите за чистотой города, отправляйте обращения и получайте эко монеты за активность. Вместе мы
            сделаем Кызылорду чище.
          </p>
          <div className="welcome-actions">
            <Button type="button" onClick={handleOpenModal}>
              Сообщить о проблеме
            </Button>
            <button type="button" className="ghost-btn" onClick={handleViewReports}>
              Мои обращения
            </button>
          </div>
        </div>
        <div className="balance-widget">
          <p>Баланс эко монет</p>
          <strong>{coinBalance}</strong>
        </div>
      </section>

      {error && (
        <div className="card">
          <div className="card-body error-state">{error}</div>
        </div>
      )}

      <section className="map-section card">
        <div className="card-header">
          <h3>Карта города</h3>
          <span className="tag">{activeReports.length}</span>
        </div>
        <div className="card-body">
          {loading && <p>Загрузка карты...</p>}
          {!loading && (
            <MapView districts={districts} stats={districtStats} onDistrictSelect={handleDistrictSelect} />
          )}
        </div>
      </section>

      <section className="grid-two-columns">
        <MyReports reports={myReports.slice(0, 4)} emptyMessage="У вас пока нет обращений. Создайте первое!" />
        <EventsList events={events.slice(0, 3)} onJoin={handleJoinEvent} />
      </section>

      {isCreateModalOpen && (
        <CreateReportModal
          categories={categories}
          categoriesLoading={categoriesLoading}
          location={selectedLocation}
          onSubmit={handleReportSubmit}
          onClose={handleCloseModal}
          loading={submitting}
          error={submitError}
        />
      )}
    </div>
  );
};

export default DashboardPage;
