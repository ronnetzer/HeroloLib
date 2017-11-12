import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

// tslint:disable:no-unused-variable
import { Observable }  from 'rxjs/Observable';
import { of }          from 'rxjs/observable/of';

// Pseudo guid generator
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
  }
  
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

@Injectable()
export class InMemDataService implements InMemoryDbService {
  createDb( reqInfo?: RequestInfo ) {
    let booksDB = [];
    
    // handle POST commands/resetDb
    if ( reqInfo ) {
      let reqBooks = reqInfo.utils.getJsonBody(reqInfo.req) || {};
      if ( reqBooks && reqBooks.length > 0 ) {
        booksDB = reqBooks;
      }
    }
    
    return of({ booksDB });
  }
  
  // Overrides id generator and delivers next available `id`, starting with 1001.
  genId<T extends { id: any }>( collection: T[], collectionName: string ): any {
    return guid();
  }
}
