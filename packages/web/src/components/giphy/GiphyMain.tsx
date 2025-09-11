import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GiphyMain.module.scss';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const url = 'https://api.giphy.com/v1/gifs/search';
const APISearch = async (query: string, limit: number, rating: string): Promise<void> => {
  const { data } = await axios.get(url, {
  params: {
    api_key: import.meta.env.REACT_APP_GIPHY_SEARCH,
    q: query,
    limit: limit ||25,
    rating: rating || 'g',
  },
});
return data;
};

const GiphyMain = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const doSearch = async (q: string): Promise<void> => {
    console.log('Searching for:', q);
    const data = await APISearch(q, 10, 'pg');
    console.log('Search results:', data);

  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await doSearch(trimmed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.giphyMain}>
      <div className={styles.content}>
        <h1>Gif Search</h1>
        
        <form onSubmit={handleSubmit}>
          <TextField
            id="main-search"
            label="GIF Search"
            variant="outlined"
            type="search"
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </Button>
        </form>

        
      </div>
    </div>
  );
};

export default GiphyMain;
