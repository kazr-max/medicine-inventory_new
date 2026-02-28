import type { User } from '../types';
import './Header.css';

interface Props {
  users: User[];
  selectedUserId: number | null;
  onUserChange: (userId: number) => void;
  onAddUser: () => void;
}

export function Header({ users, selectedUserId, onUserChange, onAddUser }: Props) {
  return (
    <header className="header">
      <h1>
        <span className="header-icon">💊</span> 薬在庫管理
      </h1>
      <div className="user-switcher">
        <label>ユーザー:</label>
        <select
          value={selectedUserId ?? ''}
          onChange={(e) => onUserChange(Number(e.target.value))}
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button className="add-user-btn" onClick={onAddUser} title="ユーザー追加">
          ＋
        </button>
      </div>
    </header>
  );
}
