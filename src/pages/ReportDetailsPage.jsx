import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReportDetails from '../components/ReportDetails';
import Button from '../components/Button';
import { fetchReportDetails, submitReportFeedback } from '../api/dataService';

const ReportDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReport = async () => {
      if (!id) {
        return;
      }
      setLoading(true);
      setError('');
      try {
        const response = await fetchReportDetails(id);
        setReport(response?.report ?? response ?? null);
      } catch (err) {
        setError('Не удалось загрузить обращение.');
      } finally {
        setLoading(false);
      }
    };
    loadReport();
  }, [id]);

  const handleFeedback = async () => {
    if (!report) {
      return;
    }
    try {
      await submitReportFeedback(report.id, { rating: 5 });
      alert('Спасибо за обратную связь!');
    } catch (err) {
      alert('Не удалось отправить обратную связь.');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <Button type="button" className="ghost-btn" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
      {loading && <p>Загрузка...</p>}
      {error && <p className="error-text">{error}</p>}
      <ReportDetails report={report} onFeedback={handleFeedback} />
    </div>
  );
};

export default ReportDetailsPage;
