import { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);

  const resetSearch = () => setSearchResults([]);

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults, resetSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
