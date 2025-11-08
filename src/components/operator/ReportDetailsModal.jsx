import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import Button from '../Button';
import { getStatusLabel } from '../../utils/reportMappings';

const statusOptions = [0, 1, 4, 2, 3, 5];

const ReportDetailsModal = ({
  report,
  onClose,
  onUpdate,
  loading,
  onUploadAfterPhoto,
}) => {
  const [statusValue, setStatusValue] = useState(report?.status ?? 0);
  const [operatorComment, setOperatorComment] = useState(report?.operatorComment ?? '');

  const canShowMap = typeof report?.latitude === 'number' && typeof report?.longitude === 'number';
  const photoBefore = report?.photoBefore || report?.photoBeforeUrl;
  const photoAfter = report?.photoAfter || report?.photoAfterUrl;
  const createdAt = useMemo(
    () => (report?.createdAt ? new Date(report.createdAt).toLocaleString() : ''),
    [report?.createdAt],
  );
  const updatedAt = useMemo(
    () => (report?.updatedAt ? new Date(report.updatedAt).toLocaleString() : ''),
    [report?.updatedAt],
  );

  useEffect(() => {
    setStatusValue(report?.status ?? 0);
    setOperatorComment(report?.operatorComment ?? '');
  }, [report]);

  if (!report) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onUpdate?.({ status: statusValue, operatorComment });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card large">
        <div className="modal-header">
          <h2>Обращение #{report.id.slice(0, 6)}</h2>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <div className="modal-body report-details-modal">
          <section className="report-info-block">
            <p>
              <strong>Категория:</strong> {report.categoryName}
            </p>
            <p>
              <strong>Адрес:</strong> {report.street}
            </p>
            <p>
              <strong>Район:</strong> {report.districtName}
            </p>
            <p>
              <strong>Описание:</strong> {report.description}
            </p>
            <p>
              <strong>Пользователь:</strong> {report.userName} {report.userPhone && `(${report.userPhone})`}
            </p>
            {createdAt && (
              <p>
                <strong>Создано:</strong> {createdAt}
              </p>
            )}
            {updatedAt && (
              <p>
                <strong>Обновлено:</strong> {updatedAt}
              </p>
            )}
            <form className="form-field" onSubmit={handleSubmit}>
              <span className="field-label">Изменить статус</span>
              <select value={statusValue} onChange={(e) => setStatusValue(Number(e.target.value))} disabled={loading}>
                {statusOptions.map((status) => (
                  <option value={status} key={status}>
                    {getStatusLabel(status)}
                  </option>
                ))}
              </select>
              <textarea
                className="field-input textarea-field"
                rows={3}
                placeholder="Комментарий оператора"
                value={operatorComment}
                onChange={(e) => setOperatorComment(e.target.value)}
                required
              />
              <Button type="submit" disabled={loading || !operatorComment.trim()}>
                Сохранить
              </Button>
            </form>
            <div className="report-photo-group">
              {photoBefore && (
                <div>
                  <p>Фото "до"</p>
                  <img src={photoBefore} alt="до" className="report-photo" />
                </div>
              )}
              {photoAfter && (
                <div>
                  <p>Фото "после"</p>
                  <img src={photoAfter} alt="после" className="report-photo" />
                </div>
              )}
            </div>
            {onUploadAfterPhoto && !photoAfter && (
              <Button type="button" onClick={() => onUploadAfterPhoto(report)}>
                Загрузить фото после
              </Button>
            )}
          </section>
          {canShowMap && (
            <section className="report-map-block">
              <MapContainer
                center={[report.latitude, report.longitude]}
                zoom={14}
                scrollWheelZoom={false}
                className="report-map__canvas"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <CircleMarker
                  center={[report.latitude, report.longitude]}
                  radius={10}
                  pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.9 }}
                />
              </MapContainer>
              <p>
                Координаты: {report.latitude.toFixed(5)}, {report.longitude.toFixed(5)}
              </p>
            </section>
          )}
        </div>
        <div className="modal-footer">
          <Button type="button" onClick={onClose} className="ghost-btn">
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsModal;
