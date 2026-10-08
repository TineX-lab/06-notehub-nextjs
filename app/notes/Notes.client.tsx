'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import type { Note } from '@/types/note';

import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import Pagination from '@/components/Pagination/Pagination';

import css from './Notes.module.css';

export default function NotesClient() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: notes = [], isLoading, isError } = useQuery({
    queryKey: ['notes', page],
    queryFn: () => fetchNotes(''),
  });

  if (isLoading) return <p className={css.container}>Loading, please wait...</p>;
  if (isError) return <p className={css.container}>Could not fetch notes.</p>;

  const filteredNotes = notes.filter((note: Note) => {
    const q = query.toLowerCase();
    return (
      note.title.toLowerCase().includes(q) ||
      note.content.toLowerCase().includes(q) ||
      (note.tag || '').toLowerCase().includes(q)
    );
  });

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.topBar}>
          <SearchBox value={query} onChange={(e) => setQuery(e.target.value)} />
          
          <Pagination
          currentPage={page}
          totalPages={4}
          onPageChange={setPage}
          />

          <button
            type="button"
            className={css.createBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Create note +
          </button>
        </div>

        <NoteList notes={filteredNotes} />

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onCancel={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    </main>
  );
}