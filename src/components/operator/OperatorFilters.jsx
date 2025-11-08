const statusOptions = [
  { value: '', label: 'Все' },
  { value: '0', label: 'Новые' },
  { value: '1', label: 'В работе' },
  { value: '2', label: 'Выполнены' },
  { value: '3', label: 'Отклонены' },
  { value: '4', label: 'На проверке' },
  { value: '5', label: 'Закрыты' },
];

const OperatorFilters = ({ filters, onChange, onApply, categories = [], districts = [] }) => {
  const handleInput = (event) => {
    const { name, value } = event.target;
    onChange?.(name, value);
  };

  return (
    <div className="operator-filters card">
      <div className="operator-filters__row">
        <label>
          Статус
          <select name="status" value={filters.status} onChange={handleInput}>
            {statusOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Район
          <select name="districtId" value={filters.districtId} onChange={handleInput}>
            <option value="">Все</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Категория
          <select name="category" value={filters.category} onChange={handleInput}>
            <option value="">Все</option>
            {categories.map((category) => (
              <option key={category.value ?? category.id} value={category.value ?? category.id}>
                {category.label ?? category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          С даты
          <input type="date" name="from" value={filters.from} onChange={handleInput} />
        </label>
        <label>
          По дату
          <input type="date" name="to" value={filters.to} onChange={handleInput} />
        </label>
        <button type="button" className="ghost-btn" onClick={onApply}>
          Применить
        </button>
      </div>
    </div>
  );
};

export default OperatorFilters;
