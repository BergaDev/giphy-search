//Return form
//Reducicing to used  
export interface singleGif {
  id: string;
  images: {
    fixed_height: {
      url: string;
      width: string;
      height: string;
    };
    original: {
      url: string;
    };
  };
  title: string;
}

export interface searchResponseGiphy {
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

//Request form
export interface giphySearchParams {
  query: string;
  limit?: number;
  rating?: string;
  lowContrast?: boolean;
  offset?: number;
}
