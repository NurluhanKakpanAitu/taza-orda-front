import { useCallback, useEffect, useState } from 'react';
import OperatorStatsCards from '../../components/operator/OperatorStatsCards';
import OperatorFilters from '../../components/operator/OperatorFilters';
import OperatorMapView from '../../components/operator/OperatorMapView';
import OperatorReportTable from '../../components/operator/OperatorReportTable';
import ReportDetailsModal from '../../components/operator/ReportDetailsModal';
import UploadAfterPhotoModal from '../../components/operator/UploadAfterPhotoModal';
import {
  fetchOperatorReports,
  fetchOperatorStats,
  fetchDistricts,
  fetchOperatorReportDetails,
  updateReportStatus,
} from '../../api/dataService';
import { uploadFile } from '../../api/reportService';

const OperatorDashboard = () => {
  const [stats, setStats] = useState({});
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ status: '0', districtId: '', category: '', from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [reportsMeta, setReportsMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [uploadTargetReport, setUploadTargetReport] = useState(null);
  const [categories] = useState([
    { value: '0', label: 'Переполненный бак' },
    { value: '1', label: 'Мусор на улице' },
    { value: '2', label: 'Нелегальная свалка' },
    { value: '3', label: 'Снег/лёд' },
    { value: '4', label: 'Контейнер' },
    { value: '5', label: 'Вывоз мусора' },
    { value: '6', label: 'Загрязнение водоёмов' },
    { value: '99', label: 'Другое' },
  ]);

  const buildReportParams = useCallback(() => {
    const params = { ...filters };
    if (params.status !== '') {
      params.status = Number(params.status);
    } else {
      delete params.status;
    }
    if (params.category !== '') {
      params.category = Number(params.category);
    } else {
      delete params.category;
    }
    if (!params.districtId) delete params.districtId;
    if (!params.from) delete params.from;
    if (!params.to) delete params.to;
    return params;
  }, [filters]);

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      try {
        const [statsResponse, reportsResponse, districtsResponse] = await Promise.all([
          fetchOperatorStats(),
          fetchOperatorReports(buildReportParams()),
          fetchDistricts(),
        ]);
        setStats(statsResponse ?? {});
        setReports(reportsResponse?.reports ?? reportsResponse ?? []);
        setReportsMeta({
          total: reportsResponse?.total ?? reportsResponse?.reports?.length ?? 0,
          page: reportsResponse?.page ?? 1,
          totalPages: reportsResponse?.totalPages ?? 1,
        });
        setDistricts(districtsResponse?.districts ?? districtsResponse ?? []);
      } catch (error) {
        console.error('Operator dashboard load error', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitial();
  }, [buildReportParams, filters.status]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    try {
      const response = await fetchOperatorReports(buildReportParams());
      setReports(response?.reports ?? response ?? []);
      setReportsMeta({
        total: response?.total ?? response?.reports?.length ?? 0,
        page: response?.page ?? 1,
        totalPages: response?.totalPages ?? 1,
      });
    } catch (error) {
      console.error('Unable to filter reports', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectReport = async (report) => {
    setDetailsLoading(true);
    try {
      const response = await fetchOperatorReportDetails(report.id);
      setSelectedReport(response?.report ?? response ?? report);
    } catch (error) {
      console.error('Не удалось загрузить обращение', error);
      setSelectedReport(report);
    } finally {
      setDetailsLoading(false);
    }
  };
 
  const handleUpdateReport = async ({ status, operatorComment }) => {
    if (!selectedReport) {
      return;
    }
    setDetailsLoading(true);
    try {
      await updateReportStatus(selectedReport.id, { status, operatorComment });
      setSelectedReport((prev) => ({ ...prev, status, operatorComment }));
      await handleApplyFilters();
    } catch (error) {
      console.error('Не удалось обновить статус', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUploadAfterPhoto = (report) => {
    setUploadTargetReport(report);
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async (file) => {
    if (!uploadTargetReport) {
      return;
    }
    setDetailsLoading(true);
    try {
      const uploadResponse = await uploadFile(file);
      await updateReportStatus(uploadTargetReport.id, {
        status: uploadTargetReport.status,
        photoAfterUrl: uploadResponse?.url,
        operatorComment: uploadTargetReport.operatorComment ?? '',
      });
      const freshDetails = await fetchOperatorReportDetails(uploadTargetReport.id);
      setSelectedReport((prev) => ({ ...(freshDetails?.report ?? freshDetails ?? prev) }));
      setShowUploadModal(false);
      setUploadTargetReport(null);
      await handleApplyFilters();
    } catch (error) {
      console.error('Не удалось загрузить фото после', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="operator-dashboard">
      <h1>Панель оператора</h1>
      <OperatorStatsCards stats={stats} loading={loading} />
      <OperatorFilters
        filters={filters}
        onChange={handleFilterChange}
        onApply={handleApplyFilters}
        categories={categories}
        districts={districts}
      />
      <OperatorMapView reports={reports} onSelect={handleSelectReport} />
      <OperatorReportTable reports={reports} meta={reportsMeta} onSelect={handleSelectReport} />

      <ReportDetailsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdate={handleUpdateReport}
        loading={detailsLoading}
        onUploadAfterPhoto={handleUploadAfterPhoto}
      />
      {showUploadModal && (
        <UploadAfterPhotoModal
          onClose={() => {
            setShowUploadModal(false);
            setUploadTargetReport(null);
          }}
          onSubmit={handleUploadSubmit}
          loading={detailsLoading}
        />
      )}
    </div>
  );
};

export default OperatorDashboard;
