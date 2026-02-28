import type { Medicine } from '../types';
import './MedicineCard.css';

interface Props {
  medicine: Medicine;
  onEdit: (medicine: Medicine) => void;
  onDelete: (medicine: Medicine) => void;
  onQuantityChange: (medicine: Medicine, delta: number) => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

export function MedicineCard({ medicine, onEdit, onDelete, onQuantityChange }: Props) {
  const statusClass =
    medicine.stockStatus === 'LOW' ? 'warning' :
    medicine.stockStatus === 'CRITICAL' ? 'danger' : '';

  const countClass =
    medicine.stockStatus === 'LOW' ? 'warning' :
    medicine.stockStatus === 'CRITICAL' ? 'danger' : 'ok';

  return (
    <div className={`medicine-card ${statusClass}`}>
      <div className="card-main">
        <div className="card-name">
          {medicine.name}
          {medicine.usageType === 'REGULAR' && (
            <span className="usage-badge regular">常用</span>
          )}
        </div>
        <div className="card-meta">
          <span>期限: {medicine.expirationDate ? formatDate(medicine.expirationDate) : '-'}</span>
          <span>閾値: {medicine.alertThreshold}個</span>
          {medicine.usageType === 'REGULAR' && medicine.dailyDose > 0 && (
            <span>1日: {medicine.dailyDose}個</span>
          )}
          {medicine.stockStatus === 'LOW' && (
            <span className="alert-badge">⚠ 残少</span>
          )}
          {medicine.stockStatus === 'CRITICAL' && (
            <span className="alert-badge danger">🔴 要補充</span>
          )}
        </div>
        <div className="card-actions-row">
          <button className="card-action-btn" onClick={() => onEdit(medicine)}>
            ✏️ 編集
          </button>
          <button className="card-action-btn danger" onClick={() => onDelete(medicine)}>
            🗑️ 削除
          </button>
        </div>
      </div>
      <div className="card-stock">
        <div className="stock-buttons">
          <button className="stock-btn" onClick={() => onQuantityChange(medicine, 1)}>
            ＋
          </button>
          <button
            className="stock-btn"
            onClick={() => onQuantityChange(medicine, -1)}
            disabled={medicine.quantity <= 0}
          >
            −
          </button>
        </div>
        <div>
          <div className={`stock-count ${countClass}`}>{medicine.quantity}</div>
          <div className="stock-unit">個</div>
        </div>
      </div>
    </div>
  );
}
