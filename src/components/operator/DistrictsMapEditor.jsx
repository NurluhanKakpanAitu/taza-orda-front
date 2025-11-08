import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, CircleMarker } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet-draw/dist/leaflet.draw.css';

const center = [44.85, 65.5];

const DistrictsMapEditor = ({
  districts = [],
  selectedDistrict,
  onCreate,
  onEdit,
  onDelete,
  onSelectDistrict,
  editable = true,
}) => {
  const featureGroupRef = useRef();

  useEffect(() => {
    if (!featureGroupRef.current) {
      return;
    }
    const layerGroup = featureGroupRef.current;
    layerGroup.clearLayers();
    districts.forEach((district) => {
      if (!district.polygonGeoJson) {
        return;
      }
      const layer = L.geoJSON(district.polygonGeoJson, {
        style: {
          color: district.color || '#2563eb',
          weight: 2,
        },
      }).addTo(layerGroup);
      layer.on('click', () => onSelectDistrict?.(district));
    });
  }, [districts, onSelectDistrict]);

  const drawOptions = useMemo(
    () => ({
      draw: {
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: '#16a34a',
            weight: 2,
          },
        },
      },
      edit: {
        featureGroup: featureGroupRef.current,
        edit: editable,
        remove: editable,
      },
    }),
    [editable],
  );

  return (
    <div className="card">
      <div className="card-header">
        <h3>Редактор районов</h3>
      </div>
      <MapContainer center={center} zoom={12} scrollWheelZoom className="districts-editor-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureGroup ref={featureGroupRef}>
          {editable && (
            <EditControl
              position="topright"
              onCreated={(e) => onCreate?.(e.layer.toGeoJSON())}
              onEdited={(e) => onEdit?.(e.layers.toGeoJSON())}
              onDeleted={(e) => onDelete?.(e.layers.toGeoJSON())}
              draw={drawOptions.draw}
              edit={drawOptions.edit}
            />
          )}
        </FeatureGroup>
        {selectedDistrict?.centerPoint && (
          <CircleMarker
            center={[selectedDistrict.centerPoint.lat, selectedDistrict.centerPoint.lng]}
            radius={8}
            pathOptions={{ color: '#f97316', fillColor: '#f97316' }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default DistrictsMapEditor;
