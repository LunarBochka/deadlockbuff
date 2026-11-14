/*import { useState, type KeyboardEvent } from 'react';
import useMicrocard from './API_request';

function Search() {
  const [input, setInput] = useState('');
  const [accountId, setAccountId] = useState('');

  const { players, loading, error } = useMicrocard(accountId);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      setAccountId(input);
    }
  };

   return (
    <div>
        
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите Steam ID"
      />

      {loading && <p>Загрузка...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && players.length === 0 && accountId && (
        <p>Ничего не найдено</p>
      )}

    </div>
  );
}

export default Search;*/

import { useState, type KeyboardEvent } from 'react';

type SearchProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export default function Search({ onSearch, placeholder = 'Поиск...' }: SearchProps) {
  const [value, setValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
    />
  );
}