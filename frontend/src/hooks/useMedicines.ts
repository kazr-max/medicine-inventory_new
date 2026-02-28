import { useCallback, useEffect, useState } from 'react';
import type { Medicine } from '../types';
import { getMedicines } from '../api/medicineApi';

export function useMedicines(userId: number | null, search: string) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMedicines = useCallback(() => {
    if (userId === null) return;
    setLoading(true);
    getMedicines(userId, search || undefined)
      .then(setMedicines)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, search]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return { medicines, loading, refetch: fetchMedicines, setMedicines };
}
