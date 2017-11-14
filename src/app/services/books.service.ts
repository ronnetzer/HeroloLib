import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { NYTBooksService, Book, ListOverview, Result, NYTResponse } from '../modules/nyt-api'

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import 'rxjs/add/operator/do'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/delay'
import 'rxjs/add/operator/filter'
import 'rxjs/add/operator/concatMap'
import 'rxjs/add/operator/distinct'
import 'rxjs/add/operator/reduce'

const cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };


@Injectable()
export class BooksService {
  
  //store received books as subject so changes will cause detection
  public _books: BehaviorSubject<Book[]> = new BehaviorSubject([]);
  public books$: Observable<Book[]> = this._books.asObservable();
  
  constructor( private http: HttpClient, private nytApi: NYTBooksService ) {
  }
  
  get booksAsArray(): Book[] {
    return this._books.value
  }
  
  /**
   * synchronize DB with books BehaviourSubject*/
  private syncDB(data: Book[]): void {
      this.http.post('commands/resetDb', this._books.value).subscribe(() => {
        this._books.next(data)
      });
  }
  
  /**
   * Get all books as a single array observable, without the lists data and duplicates
   * @description simplifies handling all books, while loosing book categories
   * @param date String - Optional, specify NY Times publication date for that week rating
   * @see {@link https://developer.nytimes.com/books_api.json#/Documentation/GET/lists/overview.%7Bformat%7D}
   */
  getAllBestSellers( date?: string ): Observable<Book[]> {
    return this.nytApi.getListsOverview(date)
    .map(( res: NYTResponse ) => res.results.lists)
    //  using concatMap to keep emit order.
    //  concat to lists
    .concatMap(( lists: ListOverview[] ) => lists)
    //  concat to books
    .concatMap(( list: ListOverview ) => list.books)
    //  add id to each book, the ISBN is going to use as id for existing books from NY Times api.
    //  convert date from string to Date object
    .do(( book: Book ) => {
      book.id = book.primary_isbn13;
      book.created_date = new Date(<string>book.created_date);
      
    })
    .distinct(( book: Book ) => book.title)
    .reduce(( bookArr: Book[], book: Book ) => bookArr.concat(book), [])
    //  update Subject and DB
    .do(( books: Book[] ) => {
      this.syncDB(books);
    });
  }
  
  addBook( newBook: Book ): Observable<any> {
    return this.http.post('api/booksDB', newBook, cudOptions).do((book: Book) => {
      let books = [...this._books.value],
        existingIdx,
        filteredBooks = books.filter(( existingBook, index ) => {
          if ( existingBook.id === book.id ) {
            existingIdx = index;
            return true;
          }
          return false;
        });
      
      if ( filteredBooks.length > 0 ) {
        books[existingIdx] = book;
      } else {
        books.unshift(book);
      }
      this._books.next(books);
    });
  }
  
  delBook( book: Book ): Observable<any> {
    return this.http.delete(`api/booksDB/${book.id}`, cudOptions)
    .do(() => {
      let booksWithoutDeleted = this._books.value.filter(existingBook => existingBook.id !== book.id);
      this._books.next(booksWithoutDeleted);
    });
  }
  
  /**
   * TODO: use this in the future for more complex layout
   */
  getBestSellersByCategory(): Observable<Result<ListOverview>> {
    return this.nytApi.getListsOverview()
    .map(( res: NYTResponse ) => res.results);
  }
}
