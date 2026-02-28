import './Fab.css';

interface Props {
  onClick: () => void;
}

export function Fab({ onClick }: Props) {
  return (
    <button className="fab" onClick={onClick} title="新規登録">
      ＋
    </button>
  );
}
