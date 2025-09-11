import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GiphyMain.module.scss';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const GiphyMain = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const doSearch = async (q: string): Promise<void> => {
    console.log('Searching for:', q);
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
