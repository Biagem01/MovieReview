import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const resetSearch = () => setSearchResults([]);

  const performSearch = async (query) => {
    if (!query) return resetSearch();
    setLoading(true);

    try {
      const response = await axios.get(`${BASE_URL}/api/search`, {
        params: { q: query }
      });
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults, resetSearch, performSearch, loading }}>
      {children}
    </SearchContext.Provider>
  );
};
