import { useState } from 'react';
import type { Medicine, MedicineRequest } from './types';
import { useUsers } from './hooks/useUsers';
import { useMedicines } from './hooks/useMedicines';
import { useDebounce } from './hooks/useDebounce';
import { createMedicine, updateMedicine, deleteMedicine, updateQuantity } from './api/medicineApi';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { MedicineCard } from './components/MedicineCard';
import { MedicineModal } from './components/MedicineModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { Fab } from './components/Fab';
import { UserModal } from './components/UserModal';
import './App.css';

function App() {
  const { users, selectedUserId, setSelectedUserId, loading: usersLoading, addUser } = useUsers();
  const [showUserModal, setShowUserModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const { medicines, loading: medicinesLoading, refetch, setMedicines } = useMedicines(selectedUserId, debouncedSearch);

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Medicine | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Medicine | null>(null);

  const handleCreate = () => {
    setEditTarget(null);
    setModalMode('create');
  };

  const handleEdit = (medicine: Medicine) => {
    setEditTarget(medicine);
    setModalMode('edit');
  };

  const handleModalSubmit = async (data: MedicineRequest) => {
    if (!selectedUserId) return;
    try {
      if (modalMode === 'create') {
        await createMedicine(selectedUserId, data);
      } else if (modalMode === 'edit' && editTarget) {
        await updateMedicine(selectedUserId, editTarget.id, data);
      }
      setModalMode(null);
      setEditTarget(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId || !deleteTarget) return;
    try {
      await deleteMedicine(selectedUserId, deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleQuantityChange = async (medicine: Medicine, delta: number) => {
    if (!selectedUserId) return;

    // Optimistic update
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === medicine.id ? { ...m, quantity: m.quantity + delta } : m
      )
    );

    try {
      const updated = await updateQuantity(selectedUserId, medicine.id, { delta });
      setMedicines((prev) =>
        prev.map((m) => (m.id === medicine.id ? updated : m))
      );
    } catch (err) {
      // Rollback on error
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === medicine.id ? { ...m, quantity: m.quantity - delta } : m
        )
      );
      console.error(err);
    }
  };

  if (usersLoading) {
    return <div className="loading-spinner">読み込み中...</div>;
  }

  return (
    <>
      <Header users={users} selectedUserId={selectedUserId} onUserChange={setSelectedUserId} onAddUser={() => setShowUserModal(true)} />
      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <div className="list-container">
        <div className="list-header">
          <h2>在庫一覧</h2>
          <span className="count-badge">全 {medicines.length} 件</span>
        </div>

        {medicinesLoading ? (
          <div className="loading-spinner">読み込み中...</div>
        ) : medicines.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💊</div>
            <p>{debouncedSearch ? '該当する薬が見つかりません' : '薬が登録されていません'}</p>
          </div>
        ) : (
          medicines.map((medicine) => (
            <MedicineCard
              key={medicine.id}
              medicine={medicine}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              onQuantityChange={handleQuantityChange}
            />
          ))
        )}
      </div>

      <Fab onClick={handleCreate} />

      {modalMode && (
        <MedicineModal
          mode={modalMode}
          medicine={editTarget}
          onSubmit={handleModalSubmit}
          onClose={() => {
            setModalMode(null);
            setEditTarget(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          medicine={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {showUserModal && (
        <UserModal
          onSubmit={async (name) => {
            try {
              await addUser(name);
              setShowUserModal(false);
            } catch (err) {
              console.error(err);
            }
          }}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </>
  );
}

export default App;
