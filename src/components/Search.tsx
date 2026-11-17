import { useState, type KeyboardEvent } from 'react';

type SearchProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

function Search({ onSearch, placeholder = 'Поиск...' }: SearchProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <div className="player-search">
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
    </div>

  );
}

export default Search;