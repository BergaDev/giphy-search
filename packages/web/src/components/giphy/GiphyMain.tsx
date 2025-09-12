import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GiphyMain.module.scss';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { IconButton, ImageList, ImageListItem, ImageListItemBar, Alert, Snackbar } from '@mui/material';
import { ContentCopy, OpenInNew } from '@mui/icons-material';

//Part of searchReponse
//Object reduced for simplicity
interface singleGif {
    id: string;
    images: {
        fixed_height: {
            url: string;
        };
    };
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
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [res, setRes] = useState<searchResponseGiphy>({
    data: [],
    pagination: {
      limit: 0,
      total_count: 0,
      offset: 0,
    },
  });

  //Function the button calls with qury
  const doSearch = async (q: string): Promise<void> => {
    console.log('Searching for:', q);
    const res = await APISearch(q, 10, 'pg');
    console.log('Search results:', res);
    //Mapping each gif to singleGif
    //Changed to pass all images in array, need to impliment some form of selection
    const items: singleGif[] = res.data.map((item) => ({
      id: item.id,
      images: item.images,
      title: item.title || 'No title provided',
    }));
    //Adding gif items and pagination to full response 
    const mappedResponse: searchResponseGiphy = {
      data: items,
      pagination: res.pagination,
    };
    console.log('Items:', items);
    console.log('Formed response:', mappedResponse);
    setRes(mappedResponse);
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyAlert(true);
    } catch (error) {
      console.error('Failed to copy link: ', error);
    }
  };

  const handleOpen = async (text: string) => {
    await window.open(text, '_blank');
  };

  //Notif handler - copy
  const handleCloseCopyAlert = () => {
    setShowCopyAlert(false);
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

        <div className={styles.images}>
        <ImageList sx={{ width: '90%', height: 450 }} cols={3} rowHeight={164}>
            {res.data.map((item) => (
                <ImageListItem key={item.id}>
                <img
                    srcSet={`${item.images.fixed_height.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={`${item.images.fixed_height.url}?w=164&h=164&fit=crop&auto=format`}
                    alt={item.title}
                    title={item.title}
                    loading="lazy"
                />
                <ImageListItemBar 
                title={item.title}
                position="below"
                actionIcon={
                    <IconButton>
                        <ContentCopy onClick={() => handleCopy(item.images.fixed_height.url)} />
                        <OpenInNew onClick={() => handleOpen(item.images.fixed_height.url)} />
                    </IconButton>
                    
                }
                />
                </ImageListItem>
            ))}
            </ImageList>

        </div>
      </div>
      
      <Snackbar
        open={showCopyAlert}
        autoHideDuration={3000}
        onClose={handleCloseCopyAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseCopyAlert} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          GIF link copied to clipboard!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default GiphyMain;
