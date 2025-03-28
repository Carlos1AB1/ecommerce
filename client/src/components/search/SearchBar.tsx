import { useState } from 'react';
import { useLocation } from 'wouter';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input 
        type="text" 
        placeholder="Buscar juegos..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-primary border border-gray-700 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-accent text-gray-200"
      />
      <FaSearch className="absolute left-3 top-3 text-gray-500" />
    </form>
  );
}
