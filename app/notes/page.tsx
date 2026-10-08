import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export default async function NotesPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const pageNumber = Number(resolvedParams?.page) || 1;
  const searchQuery = resolvedParams?.search || '';

  const initialData = await fetchNotes(pageNumber, searchQuery);

  return (
    <NotesClient
      initialData={initialData}
      currentPage={pageNumber}
      search={searchQuery}
    />
  );
}