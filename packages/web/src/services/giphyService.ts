import axios from 'axios';
import { searchResponseGiphy, giphySearchParams } from '../types/giphy';

const url = 'https://api.giphy.com/v1/gifs/search';

export const searchGifsResponse = async (params: giphySearchParams): Promise<searchResponseGiphy> => {
  const { query, limit = 25, rating = 'g', lowContrast = false, offset = 0 } = params;
  
  const { data } = await axios.get(url, {
    params: {
      api_key: import.meta.env.REACT_APP_GIPHY_SEARCH,
      q: query,
      limit,
      rating,
      remove_low_contrast: lowContrast,
      offset,
    },
  });
  
  return data;
};


export const searchGifs = async (
  query: string, 
  limit: number, 
  rating: string, 
  lowContrast?: boolean, 
  offset?: number
): Promise<searchResponseGiphy> => {
  return searchGifsResponse({
    query,
    limit,
    rating,
    lowContrast,
    offset,
  });
};
