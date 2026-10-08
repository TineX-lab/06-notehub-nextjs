'use client';

import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './Notes.module.css';

function useDebounce<T>(value: T, delay: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

interface NotesClientProps {
  currentPage?: number;
  search?: string;
}

export default function NotesClient({
  currentPage = 1,
  search = '',
}: NotesClientProps = {}) {
  const [query, setQuery] = useState(search);
  const [page, setPage] = useState(currentPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedQuery = useDebounce(query, 400);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedQuery],
    queryFn: () => fetchNotes(page, debouncedQuery),
    placeholderData: keepPreviousData,
  });

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.topBar}>
          <SearchBox value={query} onChange={handleSearchChange} />
          {data && (
            <Pagination
              currentPage={page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          )}
          <button
            type="button"
            className={css.createBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Create note +
          </button>
        </div>

        {isLoading && <p>Loading notes...</p>}
        {isError && <p>Failed to load notes.</p>}
        {data && <NoteList notes={data.notes} />}

        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <NoteForm onClose={() => setIsModalOpen(false)} />
          </Modal>
        )}
      </div>
    </main>
  );
}