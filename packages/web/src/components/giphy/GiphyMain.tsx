import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './GiphyMain.module.scss';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { IconButton, ImageList, ImageListItem, ImageListItemBar, Alert, Snackbar, Modal, Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ContentCopy, OpenInNew, MoreVert } from '@mui/icons-material';

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
        count: number;
        total_count: number;
        offset: number;
        pages?: number;
        currentPage?: number;
    };
}

const url = 'https://api.giphy.com/v1/gifs/search';
const APISearch = async (query: string, limit: number, rating: string, offset?: number): Promise<searchResponseGiphy> => {
  const { data } = await axios.get(url, {
  params: {
    api_key: import.meta.env.REACT_APP_GIPHY_SEARCH,
    q: query,
    limit: limit ||25,
    rating: rating || 'g',
    offset: offset || 0,
  },
});
return data;
};

const GiphyMain = (): JSX.Element => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  //Set response here
  const [gifResponse, setGifResponse] = useState<searchResponseGiphy>({
    data: [],
    pagination: {
      limit: 0,
      count: 0,
      total_count: 0,
      offset: 0,
      pages: 0,
      currentPage: 0,
    },
  });

  //Results limit 
  const [resultLimit, setResultLimit] = useState(10);
  //Modal control for image preview 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);

  const modalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 2,
    outline: 'none',
    maxWidth: '90vw',
    maxHeight: '90vh',
  };

  const openImageModal = (url: string) => {
    setModalImageUrl(url);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImageUrl(null);
  };
  //Page switcher
  const [pageWindowStart, setPageWindowStart] = useState(0);

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResultLimit(parseInt(e.target.value) || 10);
  };

  //Handle response mapping and pagination calculation
  const handleResponse = (res: any): void => {
    //Mapping each gif to singleGif
    //Changed to pass all images in array, need to impliment some form of selection
    const items: singleGif[] = res.data.map((item) => ({
      id: item.id,
      images: item.images,
      title: item.title || 'No title provided',
    }));
    //Calculate pages and current page
    const totalCount = res.pagination.total_count || 0;
    const limit = res.pagination.count || 1;
    const offset = res.pagination.offset || 0;
    
    //Calc total pages
    const basePages = Math.ceil(totalCount / limit);
    const totalPages = basePages > 0 ? basePages + (basePages % 2) : 1;
    
    //Force at least 1 page
    const currentPage = Math.max(1, Math.floor(offset / limit) + 1);

    //Adding gif items and pagination to full response 
    const mappedResponse: searchResponseGiphy = {
      data: items,
      pagination: {
        ...res.pagination,
        limit: items.length,
        pages: totalPages,
        currentPage: currentPage,
      },
    };
    console.log('Items:', items);
    console.log('Formed response:', mappedResponse);
    //Store the first limit to currentCountPos
    setGifResponse(mappedResponse);
    setPageWindowStart(0);
  };

  //Function the button calls with qury
  const doSearch = async (q: string): Promise<void> => {
    const res = await APISearch(q, resultLimit, 'pg');
    handleResponse(res);
  };


  const handlePageChange = async (q: string, fowards?: boolean, backwards?: boolean, selectedPage?: number): Promise<void> => {
    console.log('current vars: ', q, fowards, backwards);
    let limit = gifResponse.pagination.limit;
    let offset = gifResponse.pagination.offset;
    if (fowards) {
      offset = offset + resultLimit;
    }
    if (backwards && limit > resultLimit) {
      offset = offset - resultLimit;
    }
    if (selectedPage !== undefined && selectedPage !== null) {
      offset = (selectedPage - 1) * resultLimit;
    }
    const newResponse = await APISearch(q, limit, 'pg', offset);
    handleResponse(newResponse);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      clearPreviousSearch();
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

  const clearPreviousSearch = () => {
    setGifResponse({
      data: [],
      pagination: {
        limit: 0,
        count: 0,
        total_count: 0,
        offset: 0,
        pages: 0,
        currentPage: 0,
      },
    });
    setPageWindowStart(0);
  };

  return (
    <div className={styles.giphyMain}>
      <div className={styles.content}>
        <h1>Gif Search</h1>
        
        <form onSubmit={handleSubmit} className={styles.formOptions}>
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
          <Button variant="outlined" startIcon={<MoreVert />}>
            More Options
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </Button>
            
          <div className={styles.moreOptions}>
            <TextField
              id="resultLimit"
              label="Limit"
              variant="outlined"
              type="text"
              name="resultLimit"
              value={resultLimit}
              onChange={handleLimitChange}
            />
          </div>
        </form> 

        <div className={styles.gifResultContainer}>
            {/** Columns are based on the viewport */}
            {(() => {
              const theme = useTheme();
              const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
              const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
              const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
              const cols = isLgUp ? 4 : isMdUp ? 3 : isSmUp ? 2 : 1;
              return (
                <>
                {/* Page Switcher */}
                {/* ATM only shows first 8 pages, keep or adjust to go with display size to expand */}
                <div className={styles.pageSwitcher}>
                    {pageWindowStart > 0 ? (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          const prevStart = Math.max(0, pageWindowStart - 4);
                          setPageWindowStart(prevStart);
                        }}
                      >
                        Prev...
                      </Button>
                    ) : null}
                    {Array.from({ length: Math.max(0, Math.min((gifResponse.pagination.pages ?? 0) - pageWindowStart, 8)) }, (_, idx) => pageWindowStart + idx + 1)
                      .map((page) => (
                        <Button
                          key={page}
                          variant="outlined"
                          onClick={() => handlePageChange(query, false, true, page)}
                          disabled={gifResponse.pagination.currentPage === page}
                        >
                          {page}
                        </Button>
                      ))}
                    {(gifResponse.pagination.pages ?? 0) > pageWindowStart + 8 ? (
                      <Button
                        variant="outlined"
                        onClick={() => {
                          const totalPages = gifResponse.pagination.pages ?? 0;
                          const nextStart = pageWindowStart + 4;
                          const maxStart = Math.max(0, totalPages - 8);
                          setPageWindowStart(Math.min(nextStart, maxStart));
                        }}
                      >
                        More...
                      </Button>
                    ) : null}
                    {(gifResponse.pagination.pages ?? 0) > pageWindowStart + 8 && (
                      <Button
                        variant="outlined"
                        onClick={() => handlePageChange(query, false, false, gifResponse.pagination.pages)}
                      >
                        ({gifResponse.pagination.pages})
                      </Button>
                    )}
                </div>
                <ImageList sx={{ width: '100%' }} variant="masonry" cols={cols} gap={8}>
                    {gifResponse.data.map((item) => (
                        <ImageListItem key={item.id}>
                        <img
                            src={item.images.fixed_height.url}
                            alt={item.title}
                            title={item.title}
                            loading="lazy"
                            onClick={() => openImageModal(item.images.fixed_height.url)}
                            style={{ cursor: 'pointer', width: '100%', height: 'auto', display: 'block', borderRadius: 4 }}
                        />
                        <ImageListItemBar 
                        title={item.title}
                        actionIcon={
                            <>
                                <IconButton color="inherit" onClick={() => handleCopy(item.images.fixed_height.url)}>
                                    <ContentCopy />
                                </IconButton>
                                <IconButton color="inherit" onClick={() => handleOpen(item.images.fixed_height.url)}>
                                    <OpenInNew />
                                </IconButton>
                            </>
                        }
                        />
                        </ImageListItem>
                    ))}
                </ImageList>
                </>
              );
            })()}
        </div>
      </div>
      
      <Snackbar
        open={showCopyAlert}
        autoHideDuration={5000}
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
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
      >
        <Box sx={modalStyle}>
          {modalImageUrl ? (
            <img
              src={modalImageUrl}
              alt="GIF preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', display: 'block', margin: '0 auto' }}
            />
          ) : null}
        </Box>
      </Modal>
    </div>
  );
};

export default GiphyMain;
