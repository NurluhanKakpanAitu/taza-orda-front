const DistrictList = ({ districts = [], onSelect }) => (
  <div className="card">
    <div className="card-header">
      <h3>Районы</h3>
      <span className="tag">{districts.length}</span>
    </div>
    <div className="card-body district-list">
      {districts.map((district) => (
        <button type="button" key={district.id} className="district-item" onClick={() => onSelect?.(district)}>
          <div>
            <p className="district-name">{district.name}</p>
            <p className="district-meta">
              Цвет: <span style={{ color: district.color }}>{district.color}</span>
            </p>
          </div>
          <span className={`status-pill ${district.isActive ? 'status-active' : 'status-inactive'}`}>
            {district.isActive ? 'Активен' : 'Скрыт'}
          </span>
        </button>
      ))}
      {districts.length === 0 && <p>Районы ещё не добавлены.</p>}
    </div>
  </div>
);

export default DistrictList;
