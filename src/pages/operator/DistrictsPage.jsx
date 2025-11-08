import { useEffect, useRef, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import DistrictsMapEditor from '../../components/operator/DistrictsMapEditor';
import DistrictList from '../../components/operator/DistrictList';
import DistrictForm from '../../components/operator/DistrictForm';
import DistrictStatsPanel from '../../components/operator/DistrictStatsPanel';
import {
  fetchDistricts,
  fetchDistrictStatsPanel,
  createDistrict,
  updateDistrict,
  importDistrictGeoJson,
  exportDistrictsGeoJson,
} from '../../api/dataService';

const getGeometry = (geoJson) => {
  if (!geoJson) {
    return null;
  }

  if (geoJson.type === 'Feature') {
    return geoJson.geometry;
  }

  if (geoJson.type === 'FeatureCollection') {
    return geoJson.features?.[0]?.geometry ?? null;
  }

  return geoJson;
};

const DistrictsPage = () => {
  const { user } = useAuth();
  const canEdit = ['Operator', 'Admin'].includes(user?.role);
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [pendingGeoJson, setPendingGeoJson] = useState(null);
  const [loading, setLoading] = useState(false);
  const importInputRef = useRef();

  const loadData = async () => {
    setLoading(true);
    try {
      const [districtsResponse, statsResponse] = await Promise.all([fetchDistricts(), fetchDistrictStatsPanel()]);
      setDistricts(districtsResponse?.districts ?? districtsResponse ?? []);
      setStats(statsResponse?.stats ?? statsResponse ?? []);
    } catch (error) {
      console.error('Не удалось загрузить районы', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateFromMap = (geoJson) => {
    setPendingGeoJson(getGeometry(geoJson));
  };

  const handleEditFromMap = (geoJsonCollection) => {
    setPendingGeoJson(getGeometry(geoJsonCollection));
  };

  const handleDeleteFromMap = (geoJsonCollection) => {
    console.warn('Удаление районов требует подтверждения на сервере', geoJsonCollection);
  };

  const handleFormSubmit = async (values) => {
    const geoJsonSource = values.geoJson ? JSON.parse(values.geoJson) : pendingGeoJson;
    if (!geoJsonSource) {
      alert('Добавьте геометрию района через карту или GeoJSON.');
      return;
    }

    try {
      const parsedGeoJson = getGeometry(geoJsonSource);
      if (!parsedGeoJson) {
        alert('GeoJSON не содержит геометрию полигона.');
        return;
      }
      const payload = {
        name: values.name,
        color: values.color,
        polygonGeoJson: parsedGeoJson,
        description: values.description,
        areaInSquareKm: Number(values.areaInSquareKm) || 0,
        populationCount: Number(values.populationCount) || 0,
      };

      if (selectedDistrict) {
        await updateDistrict(selectedDistrict.id, payload);
      } else {
        await createDistrict(payload);
      }

      setPendingGeoJson(null);
      setSelectedDistrict(null);
      await loadData();
      alert('Район сохранён');
    } catch (error) {
      alert('Не удалось сохранить район');
      console.error(error);
    }
  };

  const handleImportGeoJson = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    const json = JSON.parse(text);
    const geometry = getGeometry(json);
    setPendingGeoJson(geometry);
    await importDistrictGeoJson({ polygonGeoJson: geometry ?? json });
    await loadData();
    alert('GeoJSON импортирован');
  };

  const handleExport = async () => {
    try {
      const response = await exportDistrictsGeoJson();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'districts.geojson');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Не удалось экспортировать геоданные');
    }
  };

  return (
    <div className="operator-dashboard districts-page">
      <div className="page-header">
        <div>
          <h1>Районы города</h1>
          <p>Управляйте геометрией и статусом районов Кызылорды</p>
        </div>
        <div className="district-actions">
          <button type="button" className="ghost-btn" onClick={() => importInputRef.current?.click()} disabled={!canEdit}>
            Импорт GeoJSON
          </button>
          <button type="button" className="ghost-btn" onClick={handleExport}>
            Скачать GeoJSON
          </button>
          <input
            type="file"
            ref={importInputRef}
            accept="application/geo+json,.json"
            style={{ display: 'none' }}
            onChange={handleImportGeoJson}
          />
        </div>
      </div>
      <DistrictStatsPanel stats={stats} />
      <div className="districts-grid">
        <DistrictsMapEditor
          districts={districts}
          selectedDistrict={selectedDistrict}
          onCreate={handleCreateFromMap}
          onEdit={handleEditFromMap}
          onDelete={handleDeleteFromMap}
          onSelectDistrict={setSelectedDistrict}
          editable={canEdit}
        />
        <DistrictList districts={districts} onSelect={setSelectedDistrict} />
      </div>
      {canEdit && (
        <DistrictForm
          initialValues={
            selectedDistrict && {
              name: selectedDistrict.name,
              color: selectedDistrict.color,
              geoJson: JSON.stringify(selectedDistrict.polygonGeoJson, null, 2),
              description: selectedDistrict.description ?? '',
              areaInSquareKm: selectedDistrict.areaInSquareKm ?? '',
              populationCount: selectedDistrict.populationCount ?? '',
            }
          }
          onSubmit={handleFormSubmit}
        />
      )}
      {loading && <p>Загрузка...</p>}
    </div>
  );
};

export default DistrictsPage;
