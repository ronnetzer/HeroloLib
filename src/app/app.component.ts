import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { BooksService } from "./services/books.service";
import { Book } from "./modules/nyt-api";
import { BookModalComponent } from "./modals/book-modal/book-modal.component";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public books$: Observable<Book[]> = this.booksService.books$;
  
  constructor( private booksService: BooksService,
               private dialog: MatDialog,
               private snackBar: MatSnackBar ) {
  }
  
  ngOnInit() {
    this.booksService.getAllBestSellers().subscribe();
  }
  
  /**
   * Book modal handler
   */
  openBook( data?: Book ) {
    let config = data ? { data: data } : {};
    let dialogRef: MatDialogRef<any> = this.dialog.open(BookModalComponent, config);
    
    // handle what happens after close
    dialogRef.afterClosed().subscribe(res => {
      this.snackBar.dismiss();
      if ( res == false ) {
        //  if we get false from our modal it means to delete the book
        this.booksService.delBook(data).subscribe(res => {
          console.log(res);
        });
      } else if ( res ) {
        this.booksService.addBook(res).subscribe(res => {
          console.log(res);
        });
      }
    })
  }
}
