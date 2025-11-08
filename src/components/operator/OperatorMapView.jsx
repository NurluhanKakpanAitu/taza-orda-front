import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { getStatusLabel } from '../../utils/reportMappings';

const center = [44.85, 65.5];

const statusColors = {
  New: '#f97316',
  InProgress: '#2563eb',
  Completed: '#16a34a',
  Rejected: '#b91c1c',
};

const OperatorMapView = ({ reports = [], onSelect }) => (
  <div className="operator-map card">
    <div className="card-header">
      <h3>Карта обращений</h3>
      <span className="tag">{reports.length}</span>
    </div>
    <MapContainer center={center} zoom={12} scrollWheelZoom className="operator-map__canvas">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports
        .filter((report) => typeof report.latitude === 'number' && typeof report.longitude === 'number')
        .map((report) => (
          <CircleMarker
            key={report.id}
            center={[report.latitude, report.longitude]}
          radius={10}
          pathOptions={{
            color: statusColors[report.status] || '#475467',
            fillColor: statusColors[report.status] || '#475467',
            fillOpacity: 0.85,
          }}
          eventHandlers={{
            click: () => onSelect?.(report),
          }}
        >
          <Popup>
            <p>{report.street}</p>
            <p>{report.categoryName}</p>
            <p>{getStatusLabel(report.status)}</p>
          </Popup>
        </CircleMarker>
        ))}
    </MapContainer>
  </div>
);

export default OperatorMapView;
