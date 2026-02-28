export interface User {
  id: number;
  name: string;
}

export interface UserRequest {
  name: string;
}

export interface Medicine {
  id: number;
  userId: number;
  name: string;
  usageType: string;
  quantity: number;
  expirationDate: string | null;
  dailyDose: number;
  alertThreshold: number;
  stockStatus: 'NORMAL' | 'LOW' | 'CRITICAL';
  createdAt: string;
  updatedAt: string;
}

export interface MedicineRequest {
  name: string;
  usageType: string;
  quantity: number;
  expirationDate: string | null;
  dailyDose: number;
  alertThreshold: number;
}

export interface QuantityUpdateRequest {
  delta: number;
}
