import axios from 'axios';
import { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN || '';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

export const fetchNotes = async (search: string = ''): Promise<Note[]> => {
  const { data } = await api.get('/notes', { params: search ? { search } : {} });
  return Array.isArray(data) ? data : data?.notes || [];
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (payload: Partial<Note>): Promise<Note> => {
  const { data } = await api.post('/notes', payload);
  return data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

export const updateNote = async (id: string, payload: Partial<Note>): Promise<Note> => {
  const { data } = await api.patch(`/notes/${id}`, payload);
  return data;
};