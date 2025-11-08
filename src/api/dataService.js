import axiosInstance from './axiosInstance';

const extractData = (response) => response.data;

export const fetchUserReports = async (userId) =>
  extractData(
    await axiosInstance.get('/reports', {
      params: { user_id: userId },
    }),
  );

export const fetchActiveReports = async () =>
  extractData(
    await axiosInstance.get('/reports', {
      params: { status: 'active' },
    }),
  );

export const fetchReportDetails = async (reportId) =>
  extractData(await axiosInstance.get(`/reports/${reportId}`));

export const createReport = async (payload) => extractData(await axiosInstance.post('/reports', payload));

export const submitReportFeedback = async (reportId, payload) =>
  extractData(await axiosInstance.post(`/reports/${reportId}/feedback`, payload));

export const fetchEvents = async () => extractData(await axiosInstance.get('/events'));

export const fetchCoinsHistory = async () => extractData(await axiosInstance.get('/coins/history'));

export const fetchNotifications = async () => extractData(await axiosInstance.get('/notifications'));

export const fetchDistricts = async () => extractData(await axiosInstance.get('/districts'));

export const fetchDistrictStats = async () => extractData(await axiosInstance.get('/districts/stats'));

export const fetchOperatorStats = async () => extractData(await axiosInstance.get('/operator/stats'));

export const fetchOperatorReports = async (params = {}) =>
  extractData(
    await axiosInstance.get('/operator/reports', {
      params,
    }),
  );

export const updateReportStatus = async (reportId, payload) =>
  extractData(await axiosInstance.patch(`/operator/reports/${reportId}/status`, payload));

export const fetchOperatorReportDetails = async (reportId) =>
  extractData(await axiosInstance.get(`/operator/reports/${reportId}`));

export const fetchDistrictStatsPanel = async () => extractData(await axiosInstance.get('/districts/stats'));

export const createDistrict = async (payload) => extractData(await axiosInstance.post('/districts', payload));

export const updateDistrict = async (districtId, payload) =>
  extractData(await axiosInstance.patch(`/districts/${districtId}`, payload));

export const importDistrictGeoJson = async (payload) => extractData(await axiosInstance.post('/districts/import', payload));

export const exportDistrictsGeoJson = async () => axiosInstance.get('/districts/export', { responseType: 'blob' });

export const fetchPublicEvents = async (params = {}) =>
  extractData(
    await axiosInstance.get('/events', {
      params,
    }),
  );

export const fetchEventDetails = async (id) => extractData(await axiosInstance.get(`/events/${id}`));

export const fetchOperatorEvents = async (params = {}) =>
  extractData(
    await axiosInstance.get('/events', {
      params,
    }),
  );

export const createEvent = async (payload) => extractData(await axiosInstance.post('/events', payload));

export const updateEvent = async (id, payload) => extractData(await axiosInstance.patch(`/events/${id}`, payload));

export const fetchEventParticipants = async (id) =>
  extractData(await axiosInstance.get(`/events/${id}/participants`));

export const checkInEventParticipant = async (eventId, participantId) =>
  extractData(await axiosInstance.post(`/events/${eventId}/participants/${participantId}/check-in`));

export const completeEventParticipant = async (eventId, participantId) =>
  extractData(await axiosInstance.post(`/events/${eventId}/participants/${participantId}/complete`));

export const joinEvent = async (eventId) => extractData(await axiosInstance.post(`/events/${eventId}/join`));

export const cancelEventParticipation = async (eventId) => extractData(await axiosInstance.post(`/events/${eventId}/cancel`));

export const fetchPublicEventParticipants = async (id) => extractData(await axiosInstance.get(`/events/${id}/participants`));
