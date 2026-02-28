import { useEffect } from 'react';
import type { Medicine } from '../types';
import './MedicineModal.css';
import './DeleteConfirmModal.css';

interface Props {
  medicine: Medicine;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteConfirmModal({ medicine, onConfirm, onClose }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal confirm-modal">
        <div className="confirm-icon">⚠️</div>
        <p>以下の薬を削除しますか？</p>
        <div className="medicine-name-confirm">{medicine.name}</div>
        <p className="note">この操作は取り消せません。</p>

        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            キャンセル
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
