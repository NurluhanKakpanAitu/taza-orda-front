import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const center = [44.85, 65.5];

const getPosition = (event) => {
  const lat = Number(event.latitude);
  const lng = Number(event.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  return [lat, lng];
};

const EventMapPins = ({ events = [], onSelect }) => (
  <div className="card">
    <div className="card-header">
      <h3>Карта событий</h3>
      <span className="tag">{events.length}</span>
    </div>
    <MapContainer center={center} zoom={12} scrollWheelZoom className="operator-map__canvas">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((event) => {
        const position = getPosition(event);
        if (!position) {
          return null;
        }
        return (
          <Marker key={event.id} position={position} eventHandlers={{ click: () => onSelect?.(event) }}>
            <Popup>
              <p>{event.title}</p>
              <p>{event.startAt ? new Date(event.startAt).toLocaleString() : 'Дата уточняется'}</p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  </div>
);

export default EventMapPins;
