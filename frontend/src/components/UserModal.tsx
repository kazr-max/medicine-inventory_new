import { useEffect, useState } from 'react';
import './UserModal.css';

interface Props {
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export function UserModal({ onSubmit, onClose }: Props) {
  const [name, setName] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isValid = name.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(name.trim());
  };

  return (
    <div className="modal-overlay">
      <div className="modal user-modal">
        <h2>👤 ユーザー登録</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              ユーザー名<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="例: 田中太郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              登録する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
