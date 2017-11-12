/**
 * Implementing typings for NY Times books API
 * My implementation is for /lists/overview requests
 * TODO: Implement typings for the entire api
 */

export interface NYTResponse {
  status: string;
  copyright: string;
  num_results: number;
  last_modified?: string;
  results?: Result<ListOverview>;
}

export interface Result<T> {
  bestsellers_date: string;
  published_date: string;
  published_date_description: string;
  previous_published_date: string;
  next_published_date: string;
  lists: Array<T>;
}

export interface ListOverview {
  list_id: number;
  list_name: string;
  list_name_encoded: string;
  display_name: string;
  updated: 'WEEKLY' | 'MONTHLY';
  list_image: string;
  list_image_width: number;
  list_image_height: number;
  books: Array<Book>
}

export interface Book {
  id?: string,
  age_group?: string;
  amazon_product_url?: string;
  article_chapter_link?: string;
  author: string;
  book_image?: string;
  book_image_width?: number;
  book_image_height?: number;
  book_review_link?: string;
  contributor?: string;
  contributor_note?: string;
  created_date: string;
  description: string;
  first_chapter_link?: string;
  price?: number;
  primary_isbn13?: string;
  primary_isbn10?: string;
  publisher?: string;
  rank?: number;
  rank_last_week?: number;
  sunday_review_link?: string;
  title: string;
  updated_date?: string;
  weeks_on_list?: number;
  buy_links?: Array<BuyLinks>
}

interface BuyLinks {
  name: string;
  url: string;
}
