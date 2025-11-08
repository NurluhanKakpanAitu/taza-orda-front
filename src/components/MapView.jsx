import { useMemo, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const center = [44.85, 65.5];

const defaultStyle = {
  color: '#2563eb',
  weight: 1.5,
  fillColor: '#93c5fd',
  fillOpacity: 0.2,
};

const highlightStyle = {
  ...defaultStyle,
  weight: 2.5,
  fillOpacity: 0.4,
};

const MapView = ({ districts = [], stats = [], onDistrictSelect }) => {
  const [selected, setSelected] = useState(null);

  const statsMap = useMemo(() => {
    if (Array.isArray(stats)) {
      return stats.reduce((acc, item) => {
        acc[item.districtId ?? item.id] = item;
        return acc;
      }, {});
    }
    return stats || {};
  }, [stats]);

  const geoJsonData = useMemo(() => {
    const normalizeGeometry = (district) => {
      if (district?.polygonGeoJson) {
        return district.polygonGeoJson;
      }

      if (district?.geometry) {
        return district.geometry;
      }

      if (district?.coordinates) {
        return {
          type: 'Polygon',
          coordinates: district.coordinates,
        };
      }

      return null;
    };

    return districts
      .map((district) => ({
        ...district,
        geometry: normalizeGeometry(district),
      }))
      .filter((district) => Boolean(district.geometry))
      .map((district) => ({
        type: 'Feature',
        geometry: district.geometry,
        properties: {
          id: district.id,
          name: district.name,
          description: district.description,
          centerPoint: district.centerPoint,
          reportsCount: district.reportsCount,
        },
      }));
  }, [districts]);

  if (!geoJsonData.length) {
    return (
      <div className="map-placeholder full">
        <p>Нет данных о районах. Попробуйте позже.</p>
      </div>
    );
  }

  const handleEachFeature = (feature, layer) => {
    const districtId = feature?.properties?.id;
    layer.on({
      mouseover: () => {
        layer.setStyle(highlightStyle);
      },
      mouseout: () => {
        layer.setStyle(defaultStyle);
      },
      click: (event) => {
        const districtStats = statsMap[districtId] || {};
        const eventLatLng = event.latlng
          ? {
              lat: event.latlng.lat,
              lng: event.latlng.lng,
            }
          : null;

        const fallbackLatLng =
          eventLatLng ??
          (feature.properties.centerPoint
            ? {
                lat: feature.properties.centerPoint.lat,
                lng: feature.properties.centerPoint.lng,
              }
            : null);

        const nextSelection = {
          name: feature.properties.name,
          description: feature.properties.description,
          stats: districtStats,
          position: fallbackLatLng ? [fallbackLatLng.lat, fallbackLatLng.lng] : null,
          reportsCount: feature.properties.reportsCount,
        };

        setSelected(nextSelection);

        if (fallbackLatLng) {
          onDistrictSelect?.({
            ...fallbackLatLng,
            districtId,
            districtName: feature.properties.name,
          });
        }
      },
    });
    layer.bindTooltip(feature?.properties?.name ?? 'Район', {
      direction: 'top',
      sticky: true,
    });
  };

  return (
    <div className="district-map-wrapper">
      <MapContainer center={center} zoom={12} scrollWheelZoom className="district-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData.map((feature) => (
          <GeoJSON
            key={feature.properties.id}
            data={feature}
            style={() => defaultStyle}
            onEachFeature={handleEachFeature}
          />
        ))}
        {selected && selected.position && (
          <Popup
            position={selected.position}
            eventHandlers={{
              remove: () => setSelected(null),
            }}
          >
            <div className="district-popup">
              <p className="district-name">{selected.name}</p>
              {selected.description && <p className="district-description">{selected.description}</p>}
              <p>Обращений: {selected.stats?.totalReports ?? selected.reportsCount ?? 0}</p>
              <p>Активных: {selected.stats?.activeReports ?? 0}</p>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
