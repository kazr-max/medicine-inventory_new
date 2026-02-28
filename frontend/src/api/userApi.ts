import { fetchApi } from './client';
import type { User, UserRequest } from '../types';

export function getUsers(): Promise<User[]> {
  return fetchApi<User[]>('/users');
}

export function createUser(data: UserRequest): Promise<User> {
  return fetchApi<User>('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
