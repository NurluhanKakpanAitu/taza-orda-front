import { getStatusLabel } from '../../utils/reportMappings';

const headers = [
  { key: 'createdAt', label: 'Создано' },
  { key: 'category', label: 'Категория' },
  { key: 'address', label: 'Адрес' },
  { key: 'district', label: 'Район' },
  { key: 'author', label: 'Автор' },
  { key: 'status', label: 'Статус' },
  { key: 'actions', label: '' },
];

const OperatorReportTable = ({ reports = [], onSelect, meta }) => (
  <div className="operator-table card">
    <div className="card-header">
      <h3>Список обращений ({meta?.total ?? reports.length})</h3>
    </div>
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 && (
            <tr>
              <td colSpan={headers.length}>Обращений не найдено.</td>
            </tr>
          )}
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{new Date(report.createdAt).toLocaleString()}</td>
              <td>{report.categoryName}</td>
              <td>{report.street}</td>
              <td>{report.districtName}</td>
              <td>{report.userName}</td>
              <td>{getStatusLabel(report.status)}</td>
              <td>
                <button type="button" className="ghost-btn" onClick={() => onSelect?.(report)}>
                  Подробнее
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default OperatorReportTable;
