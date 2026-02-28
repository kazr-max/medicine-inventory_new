import { useEffect, useState } from 'react';
import type { Medicine, MedicineRequest } from '../types';
import './MedicineModal.css';

interface Props {
  mode: 'create' | 'edit';
  medicine?: Medicine | null;
  onSubmit: (data: MedicineRequest) => void;
  onClose: () => void;
}

export function MedicineModal({ mode, medicine, onSubmit, onClose }: Props) {
  const [name, setName] = useState('');
  const [usageType, setUsageType] = useState('REGULAR');
  const [quantity, setQuantity] = useState('');
  const [alertThreshold, setAlertThreshold] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [dailyDose, setDailyDose] = useState('');

  useEffect(() => {
    if (mode === 'edit' && medicine) {
      setName(medicine.name);
      setUsageType(medicine.usageType);
      setQuantity(String(medicine.quantity));
      setAlertThreshold(String(medicine.alertThreshold));
      setExpirationDate(medicine.expirationDate ?? '');
      setDailyDose(String(medicine.dailyDose));
    } else {
      setName('');
      setUsageType('REGULAR');
      setQuantity('');
      setAlertThreshold('');
      setExpirationDate('');
      setDailyDose('');
    }
  }, [mode, medicine]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isValid =
    name.trim() !== '' &&
    quantity !== '' && Number(quantity) >= 0 &&
    alertThreshold !== '' && Number(alertThreshold) >= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      name: name.trim(),
      usageType,
      quantity: Number(quantity),
      alertThreshold: Number(alertThreshold),
      expirationDate: expirationDate || null,
      dailyDose: usageType === 'REGULAR' && dailyDose ? Number(dailyDose) : 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h2>{mode === 'create' ? '💊 薬の新規登録' : '✏️ 薬情報の編集'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              薬名<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="例: ロキソニン"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>種別</label>
            <select
              className="form-select"
              value={usageType}
              onChange={(e) => setUsageType(e.target.value)}
            >
              <option value="REGULAR">常用</option>
              <option value="AS_NEEDED">頓服</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                数量<span className="required">*</span>
              </label>
              <input
                type="number"
                placeholder="例: 10"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <div className="form-hint">現在の在庫数を入力</div>
            </div>
            <div className="form-group">
              <label>
                アラート閾値<span className="required">*</span>
              </label>
              <input
                type="number"
                placeholder="例: 5"
                min="0"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
              />
              <div className="form-hint">この数以下でLINE通知</div>
            </div>
          </div>

          {usageType === 'REGULAR' && (
            <div className="form-group">
              <label>1日の服用数</label>
              <input
                type="number"
                placeholder="例: 3"
                min="0"
                value={dailyDose}
                onChange={(e) => setDailyDose(e.target.value)}
              />
              <div className="form-hint">毎朝8時に自動で在庫を減らします</div>
            </div>
          )}

          <div className="form-group">
            <label>使用期限</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary" disabled={!isValid}>
              {mode === 'create' ? '登録する' : '更新する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
