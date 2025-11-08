import { MapContainer, CircleMarker, TileLayer } from 'react-leaflet';
import { getCategoryLabel, getStatusLabel } from '../utils/reportMappings';

const resolvePhotoUrl = (item) => item?.photoUrl || item?.photo_url;

const ReportDetails = ({ report, onFeedback }) => {
  if (!report) {
    return (
      <div className="card">
        <div className="card-body">
          <p>Загрузка информации об обращении...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>{getCategoryLabel(report.category)}</h3>
        <span className={`status-pill status-${report.status}`}>{getStatusLabel(report.status)}</span>
      </div>
      <div className="card-body report-details">
        <p>
          <strong>Адрес:</strong> {report.address}
        </p>
        <p>
          <strong>Описание:</strong> {report.description}
        </p>
        {report.location?.lat && report.location?.lng && (
          <>
            <p>
              <strong>Координаты:</strong> {report.location.lat.toFixed(5)}, {report.location.lng.toFixed(5)}
            </p>
            <div className="report-map">
              <MapContainer
                center={[report.location.lat, report.location.lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="report-map__canvas"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker
                  center={[report.location.lat, report.location.lng]}
                  radius={10}
                  pathOptions={{ color: '#2563eb', fillColor: '#2d7ff9', fillOpacity: 0.85 }}
                />
              </MapContainer>
            </div>
          </>
        )}
        {resolvePhotoUrl(report) && (
          <img src={resolvePhotoUrl(report)} alt={report.category} className="report-photo" loading="lazy" width= "300px" height="300px"/>
        )}
        {report.feedbackAllowed && (
          <button type="button" className="primary-btn" onClick={() => onFeedback?.(report)}>
            Оценить выполнение
          </button>
        )}
      </div>
    </div>
  );
};

export default ReportDetails;
