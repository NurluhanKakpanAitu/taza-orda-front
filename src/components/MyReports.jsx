import { getCategoryLabel, getStatusLabel } from '../utils/reportMappings';

const resolvePhotoUrl = (report) => report.photoUrl || report.photo_url;

const MyReports = ({ reports = [], emptyMessage = 'У вас пока нет обращений.' }) => (
  <div className="card">
    <div className="card-header">
      <h3>Мои обращения</h3>
      <span className="tag">{reports.length}</span>
    </div>
    <div className="card-body">
      {reports.length === 0 && <p>{emptyMessage}</p>}
      <ul className="reports-list">
        {reports.map((report) => {
          const photoUrl = resolvePhotoUrl(report);
          return (
            <li key={report.id}>
              <a className="report-link" href={`/reports/${report.id}`}>
                <div className="report-info">
                  <p className="report-title">{getCategoryLabel(report.category)}</p>
                  <p className="report-meta">
                    {report.address}
                    {report.location?.lat && report.location?.lng &&
                      ` • ${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                  </p>
                </div>
                {photoUrl && <img className="report-thumb" src={photoUrl} alt={report.category} />}
                <span className={`status-pill status-${report.status}`}>{getStatusLabel(report.status)}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  </div>
);

export default MyReports;
