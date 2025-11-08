import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import Button from '../Button';
import DistrictsMapEditor from '../operator/DistrictsMapEditor';

const cityCenter = [44.85, 65.5];

const defaultEvent = {
  id: null,
  title: '',
  description: '',
  startAt: '',
  endAt: '',
  districtId: '',
  latitude: '',
  longitude: '',
  coinReward: '',
  coverUrl: '',
};

const toNumberValue = (value) => {
  if (value === '' || value === null || value === undefined) {
    return '';
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? '' : parsed;
};

const toInputDateTime = (value) => {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  const tzOffset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - tzOffset);
  return local.toISOString().slice(0, 16);
};

const toCoordinate = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const normalizeValues = (payload = {}) => {
  const base = { ...defaultEvent, ...payload };
  base.startAt = toInputDateTime(base.startAt);
  base.endAt = toInputDateTime(base.endAt);
  base.latitude = toNumberValue(base.latitude);
  base.longitude = toNumberValue(base.longitude);
  base.coinReward = base.coinReward ?? '';
  base.districtId = base.districtId ? String(base.districtId) : '';
  return base;
};

const LocationSelector = ({ onSelect, disabled }) => {
  useMapEvents({
    click: (event) => {
      if (disabled) {
        return;
      }
      const { lat, lng } = event.latlng;
      onSelect({
        lat: Number(lat.toFixed(6)),
        lng: Number(lng.toFixed(6)),
      });
    },
  });

  return null;
};

const toIsoString = (value) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const EventForm = ({ initialValues, districts = [], onSubmit, onUploadCover, submitting = false }) => {
  const preparedValues = useMemo(() => normalizeValues(initialValues), [initialValues]);
  const [values, setValues] = useState(preparedValues);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [coverUploading, setCoverUploading] = useState(false);

  useEffect(() => {
    setValues(preparedValues);
  }, [preparedValues]);

  useEffect(() => {
    if (!preparedValues?.districtId) {
      setSelectedDistrict(null);
      return;
    }
    const match = districts.find((district) => String(district.id) === String(preparedValues.districtId));
    setSelectedDistrict(match ?? null);
  }, [districts, preparedValues?.districtId]);

  const mapPosition = useMemo(() => {
    if (typeof values.latitude === 'number' && typeof values.longitude === 'number') {
      return [values.latitude, values.longitude];
    }
    if (selectedDistrict?.centerPoint) {
      const lat = toCoordinate(selectedDistrict.centerPoint.lat);
      const lng = toCoordinate(selectedDistrict.centerPoint.lng);
      if (lat !== null && lng !== null) {
        return [lat, lng];
      }
    }
    return cityCenter;
  }, [selectedDistrict, values.latitude, values.longitude]);
  const mapKey = `${mapPosition[0]}-${mapPosition[1]}`;
  const hasLocation = typeof values.latitude === 'number' && typeof values.longitude === 'number';
  const canSelectPoint = Boolean(selectedDistrict);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'districtId') {
      const district = districts.find((d) => String(d.id) === value);
      setSelectedDistrict(district ?? null);
      setValues((prev) => {
        const next = { ...prev, [name]: value };
        if (district?.centerPoint && prev.latitude === '' && prev.longitude === '') {
          const lat = toCoordinate(district.centerPoint.lat);
          const lng = toCoordinate(district.centerPoint.lng);
          if (lat !== null && lng !== null) {
            next.latitude = lat;
            next.longitude = lng;
          }
        }
        return next;
      });
      return;
    }

    if (name === 'latitude' || name === 'longitude') {
      setValues((prev) => ({ ...prev, [name]: toNumberValue(value) }));
      return;
    }

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(district);
    setValues((prev) => {
      const next = { ...prev, districtId: district?.id ? String(district.id) : '' };
      if (district?.centerPoint && prev.latitude === '' && prev.longitude === '') {
        const lat = toCoordinate(district.centerPoint.lat);
        const lng = toCoordinate(district.centerPoint.lng);
        if (lat !== null && lng !== null) {
          next.latitude = lat;
          next.longitude = lng;
        }
      }
      return next;
    });
  };

  const handleSelectLocation = ({ lat, lng }) => {
    if (!canSelectPoint) {
      return;
    }
    setValues((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !onUploadCover) {
      return;
    }
    setCoverUploading(true);
    try {
      const uploadedUrl = await onUploadCover(file);
      if (uploadedUrl) {
        setValues((prev) => ({ ...prev, coverUrl: uploadedUrl }));
      }
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...(values.id ? { id: values.id } : {}),
      title: values.title,
      description: values.description,
      coinReward: values.coinReward === '' ? 0 : Number(values.coinReward),
      startAt: toIsoString(values.startAt),
      endAt: toIsoString(values.endAt),
      districtId: values.districtId || null,
      latitude: typeof values.latitude === 'number' ? values.latitude : null,
      longitude: typeof values.longitude === 'number' ? values.longitude : null,
      coverUrl: values.coverUrl || null,
    };
    onSubmit?.(payload);
  };

  const handleClearLocation = () => {
    setValues((prev) => ({ ...prev, latitude: '', longitude: '' }));
  };

  return (
    <>
      <div className="event-form card">
        <div className="card-header">
          <div>
            <p className="card-eyebrow">{initialValues ? 'Редактирование события' : 'Новая акция'}</p>
            <h3>{values.title ? values.title : 'Укажите название события'}</h3>
          </div>
          <span className="tag">{selectedDistrict ? selectedDistrict.name : 'Район не выбран'}</span>
        </div>
        <form className="event-form-sections" onSubmit={handleSubmit}>
          <section className="event-form-section">
            <div className="event-form-section__header">
              <h4>Основная информация</h4>
              <p>Название и описание увидят жители в публичном списке.</p>
            </div>
            <div className="event-form-grid">
              <label className="form-field span-2">
                <span className="field-label">Заголовок</span>
                <input name="title" className="field-input" value={values.title} onChange={handleChange} required />
              </label>
              <label className="form-field span-2">
                <span className="field-label">Описание</span>
                <textarea
                  name="description"
                  className="field-input textarea-field"
                  rows={4}
                  placeholder="Добавьте детали: место встречи, задачи, инвентарь..."
                  value={values.description}
                  onChange={handleChange}
                />
              </label>
            </div>
          </section>
          <section className="event-form-section">
            <div className="event-form-section__header">
              <h4>Расписание и вознаграждение</h4>
              <p>Укажите время начала и окончания мероприятия.</p>
            </div>
            <div className="event-form-grid">
              <label className="form-field">
                <span className="field-label">Начало</span>
                <input
                  type="datetime-local"
                  name="startAt"
                  className="field-input"
                  value={values.startAt}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-field">
                <span className="field-label">Окончание</span>
                <input
                  type="datetime-local"
                  name="endAt"
                  className="field-input"
                  value={values.endAt}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className="form-field">
                <span className="field-label">Награда (эко монеты)</span>
                <input
                  name="coinReward"
                  type="number"
                  min="0"
                  step="1"
                  className="field-input"
                  value={values.coinReward}
                  onChange={handleChange}
                  placeholder="Например, 50"
                />
              </label>
            </div>
          </section>
          <section className="event-form-section">
            <div className="event-form-section__header">
              <h4>Район и точка на карте</h4>
              <p>Сначала выберите район, затем поставьте маркер точного места.</p>
            </div>
            <div className="event-form-grid">
              <label className="form-field">
                <span className="field-label">Район</span>
                <select name="districtId" className="field-input" value={values.districtId} onChange={handleChange} required>
                  <option value="">Выберите район</option>
                  {districts.map((d) => (
                    <option value={d.id} key={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <span className="field-hint">Можно выбрать район и на карте ниже.</span>
              </label>
            </div>
            <div className="event-location-picker">
              <div className="event-location-picker__header">
                <div>
                  <p className="field-label">Точка на карте</p>
                  <p className="field-hint">{canSelectPoint ? 'Кликните по карте, чтобы отметить точку сбора.' : 'Сначала выберите район.'}</p>
                </div>
                {hasLocation && (
                  <button type="button" className="ghost-btn ghost-btn--small" onClick={handleClearLocation}>
                    Очистить точку
                  </button>
                )}
              </div>
              <div className="event-location-picker__grid">
                <div className="event-location-picker__map">
                  <MapContainer key={mapKey} center={mapPosition} zoom={14} scrollWheelZoom className="event-location-map">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationSelector onSelect={handleSelectLocation} disabled={!canSelectPoint} />
                    {hasLocation && <Marker position={[values.latitude, values.longitude]} />}
                  </MapContainer>
                  {!canSelectPoint && <div className="event-location-overlay">Выберите район, чтобы установить метку</div>}
                </div>
                <div className="event-location-picker__inputs">
                  <label className="form-field">
                    <span className="field-label">Широта</span>
                    <input
                      name="latitude"
                      type="number"
                      step="0.000001"
                      placeholder="44.850000"
                      className="field-input"
                      value={values.latitude === '' ? '' : values.latitude}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="form-field">
                    <span className="field-label">Долгота</span>
                    <input
                      name="longitude"
                      type="number"
                      step="0.000001"
                      placeholder="65.500000"
                      className="field-input"
                      value={values.longitude === '' ? '' : values.longitude}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>
          <section className="event-form-section">
            <div className="event-form-section__header">
              <h4>Обложка</h4>
              <p>Яркое изображение выделит событие в списке.</p>
            </div>
            <label className="form-field span-2">
              <span className="field-label">Изображение</span>
              <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={coverUploading} />
              {coverUploading && <span className="field-hint">Загружаем изображение...</span>}
              {values.coverUrl && <img src={values.coverUrl} alt="cover" className="event-cover-preview" />}
            </label>
          </section>
          <div className="event-form-actions">
            <Button type="submit" className="primary-btn" loading={submitting}>
              Сохранить событие
            </Button>
          </div>
        </form>
      </div>
      <DistrictsMapEditor
        districts={districts}
        selectedDistrict={selectedDistrict}
        onSelectDistrict={handleSelectDistrict}
        editable={false}
      />
    </>
  );
};

export default EventForm;
