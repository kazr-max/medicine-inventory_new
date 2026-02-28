import { useEffect, useState } from 'react';
import type { User } from '../types';
import { getUsers, createUser } from '../api/userApi';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((data) => {
        setUsers(data);
        if (data.length > 0) {
          setSelectedUserId(data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addUser = async (name: string) => {
    const newUser = await createUser({ name });
    setUsers((prev) => [...prev, newUser]);
    setSelectedUserId(newUser.id);
    return newUser;
  };

  return { users, selectedUserId, setSelectedUserId, loading, addUser };
}
