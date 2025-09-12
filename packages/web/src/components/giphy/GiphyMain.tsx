import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GiphyMain.module.scss';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ImageList, ImageListItem } from '@mui/material';

//Part of searchReponse
//Object reduced for simplicity
interface singleGif {
    id: string;
    embed_url: string;
    title: string;
}

//Main API response 
interface searchResponseGiphy {
    data: singleGif[];
    pagination: {
        limit: number;
        total_count: number;
        offset: number;
        pages?: number;
        currentPage?: number;
    };
}

const url = 'https://api.giphy.com/v1/gifs/search';
const APISearch = async (query: string, limit: number, rating: string): Promise<searchResponseGiphy> => {
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

  //Function the button calls with qury
  const doSearch = async (q: string): Promise<void> => {
    console.log('Searching for:', q);
    const res = await APISearch(q, 10, 'pg');
    console.log('Search results:', res);
    //Mapping each gif to singleGif
    //TODO: Change from embed url, does return a gif but want to choose more with the images array
    const items: singleGif[] = res.data.map((item) => ({
      id: item.id,
      embed_url: item.embed_url,
      title: item.title,
    }));
    //Adding gif items and pagination to full response 
    const mappedResponse: searchResponseGiphy = {
      data: items,
      pagination: res.pagination,
    };
    console.log('Items:', items);
    console.log('Formed response:', mappedResponse);

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
