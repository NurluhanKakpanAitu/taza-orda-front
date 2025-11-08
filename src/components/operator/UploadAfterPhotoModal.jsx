import { useState } from 'react';
import Button from '../Button';

const UploadAfterPhotoModal = ({ onSubmit, onClose, loading }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] ?? null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(file);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Фото после уборки</h2>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
          <Button type="submit" loading={loading} disabled={!file || loading}>
            Загрузить
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UploadAfterPhotoModal;
