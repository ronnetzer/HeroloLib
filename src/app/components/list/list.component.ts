import {
  Component, ComponentRef, ComponentFactory, ComponentFactoryResolver,
  OnInit, OnChanges, SimpleChanges, SimpleChange,
  Input, Output, EventEmitter,
  ChangeDetectionStrategy, ChangeDetectorRef, Injector
} from '@angular/core';

import { Book } from "../../modules/nyt-api/nyt.interface";
import { NgxSiemaOptions, NgxSiemaService, NgxSiemaSlideComponent } from "ngx-siema";

import { ThumbnailComponent } from "../thumbnail/thumbnail.component";

@Component({
  selector: 'app-book-carousel',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit, OnChanges {
  @Input('books') books: Book[];
  @Output('details') details: EventEmitter<Book> = new EventEmitter();
  
  private carouselOptions: NgxSiemaOptions;
  
  constructor( private cdRef: ChangeDetectorRef,
               private cfResolver: ComponentFactoryResolver,
               private injector: Injector,
               private carousel: NgxSiemaService ) {
    
  }
  
  ngOnInit() {
    // handle changes manually
    this.cdRef.detach();
    
    this.carouselOptions = {
      selector: '.siema',
      duration: 200,
      easing: 'ease-out',
      perPage: 5,
      startIndex: 0,
      draggable: false,
      threshold: 20,
      loop: false
    };
    
  }
  
  ngOnChanges( changes: SimpleChanges ) {
    //  detecting changes in books to see if any book removed/added/updated
    let books: SimpleChange = changes['books'];
    if ( !books.firstChange && books.currentValue.length > 0 ) {
      // init data
      if ( books.previousValue.length == 0 ) return this.cdRef.detectChanges();
      
      // book deleted
      if ( books.previousValue.length > books.currentValue.length ) {
        let deletedIdx: number;
        books.previousValue.some(( book: Book, idx: number ) => {
          if ( books.currentValue[idx] ) {
            if ( book.id !== books.currentValue[idx].id ) {
              deletedIdx = idx;
              return true;
            }
          }
        });
        return this.carousel.remove(deletedIdx);
      }
      //  book added
      else if ( books.previousValue.length < books.currentValue.length ) {
        // new book will always be at index 0;
        let newBookNode = this.createSlide(books.currentValue[0]);
        this.carousel.prepend(newBookNode);
        return this.carousel.goTo(0);
      }
      // book changed
      else {
        // scan array for any changed book (deep comparison)
        let changedBookNode, changedIdx;
        books.currentValue.some(( book: Book, idx: number ) => {
          for ( let prop in book ) {
            if ( book[prop] !== books.previousValue[idx][prop] ) {
              changedIdx = idx;
              return true;
            }
          }
        });
        changedBookNode = this.createSlide(books.currentValue[changedIdx]);
        this.carousel.remove(changedIdx);
        return this.carousel.insert(changedBookNode, changedIdx);
      }
    }
  }
  
  createSlide( bookData: Book ): HTMLElement {
    let thumbnailComponentFactory: ComponentFactory<ThumbnailComponent>,
      slideComponentFactory: ComponentFactory<NgxSiemaSlideComponent>,
      thumbnailComponent: ComponentRef<ThumbnailComponent>;
    
    // create factories
    thumbnailComponentFactory = this.cfResolver.resolveComponentFactory(ThumbnailComponent);
    slideComponentFactory = this.cfResolver.resolveComponentFactory(NgxSiemaSlideComponent);
    
    // create thumbnail
    thumbnailComponent = thumbnailComponentFactory.create(this.injector);
    
    // add content
    thumbnailComponent.instance.coverUrl = bookData.book_image;
    thumbnailComponent.instance.alt = bookData.title;
    thumbnailComponent.instance.openDetails.subscribe(() => this.openDetails(bookData));
    thumbnailComponent.changeDetectorRef.detectChanges();
    
    // create and return slide component with thumbnail as projectableNode
    return slideComponentFactory.create(this.injector, [[thumbnailComponent.location.nativeElement]]).location.nativeElement;
  }
  
  prevBook(): void {
    this.carousel.prev();
  }
  
  nextBook(): void {
    this.carousel.next();
  }
  
  openDetails( book: Book ): void {
    this.details.emit(book);
  }
}
