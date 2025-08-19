import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Resetta i risultati della ricerca
  const resetSearch = () => setSearchResults([]);

  // Funzione helper per aggiornare i risultati
  const updateSearchResults = (results) => {
    setSearchResults(results || []);
  };

  const value = {
    searchResults,
    setSearchResults: updateSearchResults,
    resetSearch,
    loading,
    setLoading
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
