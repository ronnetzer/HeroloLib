import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { Book } from "../../modules/nyt-api";
import { BooksService } from "../../services/books.service";
import { TitlePipe } from "../../pipes/title.pipe";

@Component({
  selector: 'app-book-modal',
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.scss']
})
export class BookModalComponent implements OnInit {
  private saved: boolean;
  private changed: boolean;
  editMode: boolean;
  book: Book;
  title: string;
  bookFormGroup: FormGroup;
  
  constructor( private bookService: BooksService,
               private titlePipe: TitlePipe,
               private snackBar: MatSnackBar,
               private formBuilder: FormBuilder,
               private dialogRef: MatDialogRef<BookModalComponent>,
               @Inject(MAT_DIALOG_DATA) public data: Book ) {
    
    this.changed = false;
    this.saved = false;
    this.editMode = !data;
    
    // create dynamic form
    this.bookFormGroup = this.formBuilder.group({
      author: ['', [Validators.required]],
      title: ['', [Validators.required/*, Validators.pattern(`[A-Za-z() 0-9,'.]+`)*/, this.duplicateTitle()]],
      description: ['', [Validators.required]],
      created_date: ['', [Validators.required]],
      book_image: ['', [Validators.required, Validators.pattern(`(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))`)]]
    })
  }
  
  ngOnInit() {
    if ( this.data ) {
      // clone the data
      this.book = <Book>{ ...this.data };
      
      this.bookFormGroup.disable();
      this.bookFormGroup.patchValue(this.book);
      
      // capitalize title
      this.transformTitle();
    } else {
      this.title = 'Create Book';
    }
  }
  
  editBook(): void {
    this.bookFormGroup.enable();
    this.editMode = true;
  }
  
  saveBook(): void {
    if ( this.bookFormGroup.pristine ) {
      this.dialogRef.close(null);
      return;
    }
    this.book = Object.assign({}, this.book, this.bookFormGroup.value);
    this.dialogRef.close(this.book);
  }
  
  revertChanges(): void {
    this.snackBar.open('All changes will be lost', 'OK')
    .onAction().subscribe(() => {
      this.editMode = false;
      this.bookFormGroup.patchValue(this.book);
      // capitalize title
      this.transformTitle();
      this.bookFormGroup.disable();
    })
  }
  
  deleteBook(): void {
    this.snackBar.open('Are you sure?', 'YES')
    .onAction().subscribe(() => this.dialogRef.close(false));
    //  false means to delete the book
  }
  
  // Image url value validator, dont pass value to thumbnail preview until email is a valid url.
  isImageUrl( formControl: string ): string | null {
    let regex = new RegExp(`(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|svg))`);
    if ( regex.test(this.bookFormGroup.get(formControl).value) ) {
      return this.bookFormGroup.get(formControl).value;
    }
    return null;
  }
  
  // duplicate title validator
  private duplicateTitle(): ValidatorFn {
    
    return ( control: AbstractControl ): {[key: string]: any} => {
      // converting
      let transformedValue = control.value.replace(/[^A-Za-z() 0-9,'.]/g, '').toUpperCase();
      let matchedArr = this.bookService.booksAsArray.filter(( book: Book ) => book.title.toUpperCase() === transformedValue);
      
      if ( matchedArr.length > 0 ) {
        if ( this.book ) {
          if ( transformedValue != this.book.title && transformedValue === matchedArr[0].title ) {
            return { 'duplicateTitle': { value: control.value.toUpperCase() } }
          }
        } else if ( transformedValue === matchedArr[0].title ) {
          return { 'duplicateTitle': { value: control.value.toUpperCase() } }
        }
      }
      return null;
    };
  }
  
  // Applying TitlePipe
  private transformTitle() {
    let transformedTitle = this.titlePipe.transform(this.book.title);
    this.bookFormGroup.patchValue({ title: transformedTitle })
  }
}
