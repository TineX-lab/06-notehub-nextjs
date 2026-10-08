export default function SearchBox({ value, onChange }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Search notes..."
      style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc', width: '300px' }}
    />
  );
}