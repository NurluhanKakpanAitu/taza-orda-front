import { useEffect, useMemo, useState } from 'react';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

const initialPayload = {
  categoryId: '',
  description: '',
  street: '',
};

const CreateReportModal = ({
  categories = [],
  location,
  onSubmit,
  onClose,
  loading,
  error,
  categoriesLoading,
}) => {
  const [formValues, setFormValues] = useState(initialPayload);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(
    () => () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl],
  );

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);

    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl('');
    }
  };

  const resetForm = () => {
    setFormValues(initialPayload);
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit?.({ ...formValues, file: selectedFile }, resetForm);
  };

  const isSubmitDisabled = useMemo(
    () =>
      !formValues.categoryId ||
      !formValues.description.trim() ||
      !selectedFile ||
      !location?.lat ||
      !location?.lng ||
      !location?.districtId,
    [formValues, selectedFile, location],
  );

  const locationLabel =
    location?.lat && location?.lng
      ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}${
          location?.districtName ? ` • ${location.districtName}` : ''
        }`
      : null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Сообщить о проблеме</h2>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body" noValidate>
          <div className="form-field">
            <label htmlFor="categoryId" className="field-label">
              Категория *
            </label>
            <select
              id="categoryId"
              name="categoryId"
              className="field-input"
              value={formValues.categoryId}
              onChange={handleChange}
              disabled={categoriesLoading}
              required
            >
              <option value="">{categoriesLoading ? 'Загрузка категорий...' : 'Выберите категорию'}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="street" className="field-label">
              Улица / ориентир
            </label>
            <input
              id="street"
              name="street"
              className="field-input"
              placeholder="Например, Абая 15"
              value={formValues.street}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="description" className="field-label">
              Описание *
            </label>
            <textarea
              id="description"
              name="description"
              className="field-input textarea-field"
              rows={4}
              placeholder="Опишите проблему"
              value={formValues.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="field-label" htmlFor="photo">
              Фото * <span className="field-hint">Прикрепите изображение проблемы</span>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleFileChange}
              className="file-input"
              required
            />
            {previewUrl && (
              <div className="photo-preview">
                <img src={previewUrl} alt="Предпросмотр" />
              </div>
            )}
          </div>

          <div className="location-pill">
            <p>
              <strong>Локация:</strong> {locationLabel || 'Выберите район на карте'}
            </p>
            {!location?.districtId && <p className="field-hint">Нажмите на район на карте, чтобы выбрать точку</p>}
          </div>

          {error && <ErrorMessage message={error} />}
          <Button type="submit" loading={loading} disabled={isSubmitDisabled || loading}>
            Отправить
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateReportModal;
