import { fetchApi } from './client';
import type { Medicine, MedicineRequest, QuantityUpdateRequest } from '../types';

export function getMedicines(userId: number, search?: string): Promise<Medicine[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return fetchApi<Medicine[]>(`/users/${userId}/medicines${params}`);
}

export function createMedicine(userId: number, data: MedicineRequest): Promise<Medicine> {
  return fetchApi<Medicine>(`/users/${userId}/medicines`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateMedicine(userId: number, id: number, data: MedicineRequest): Promise<Medicine> {
  return fetchApi<Medicine>(`/users/${userId}/medicines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteMedicine(userId: number, id: number): Promise<void> {
  return fetchApi<void>(`/users/${userId}/medicines/${id}`, {
    method: 'DELETE',
  });
}

export function updateQuantity(userId: number, id: number, data: QuantityUpdateRequest): Promise<Medicine> {
  return fetchApi<Medicine>(`/users/${userId}/medicines/${id}/quantity`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
