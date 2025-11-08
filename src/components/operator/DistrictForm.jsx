import { useEffect, useState } from 'react';

const defaultValues = {
  name: '',
  color: '#2d7ff9',
  description: '',
  areaInSquareKm: '',
  populationCount: '',
};

const DistrictForm = ({ initialValues, onSubmit }) => {

  const [formValues, setFormValues] = useState(initialValues ?? defaultValues);

  useEffect(() => {
    setFormValues(initialValues ?? defaultValues);
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(formValues);
  };

  return (
    <form className="district-form card" onSubmit={handleSubmit}>
      <div className="card-header">
        <h3>{initialValues ? 'Редактировать район' : 'Создать район'}</h3>
      </div>
      <div className="card-body district-form-grid">
        <label className="form-field">
          <span className="field-label">Название</span>
          <input name="name" className="field-input" value={formValues.name} onChange={handleChange} required />
        </label>
        <label className="form-field">
          <span className="field-label">Цвет</span>
          <input name="color" type="color" className="field-input" value={formValues.color} onChange={handleChange} />
        </label>
        <label className="form-field span-2">
          <span className="field-label">Описание</span>
          <textarea
            name="description"
            className="field-input textarea-field"
            rows={2}
            value={formValues.description}
            onChange={handleChange}
            placeholder="Кратко опишите район"
          />
        </label>
        <label className="form-field">
          <span className="field-label">Площадь (км²)</span>
          <input
            name="areaInSquareKm"
            className="field-input"
            type="number"
            step="0.01"
            min="0"
            value={formValues.areaInSquareKm}
            onChange={handleChange}
          />
        </label>
        <label className="form-field">
          <span className="field-label">Население</span>
          <input
            name="populationCount"
            className="field-input"
            type="number"
            min="0"
            value={formValues.populationCount}
            onChange={handleChange}
          />
        </label>
     </div>
      <div className="card-footer">
        <button type="submit" className="primary-btn">
          Сохранить
        </button>
      </div>
    </form>
  );
};

export default DistrictForm;
