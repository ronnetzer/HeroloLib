import {
  Component,
  OnInit,
  Input, Output, EventEmitter,
  ChangeDetectionStrategy,
  ViewContainerRef, ApplicationRef, ComponentFactoryResolver, Injector, TemplateRef, ViewChild
} from '@angular/core';

import { Book } from "../../modules/nyt-api/nyt.interface";
import { NgxSiemaOptions, NgxSiemaService } from "ngx-siema";

import { DomPortalHost, TemplatePortal } from '@angular/cdk/portal';

import { Observable } from "rxjs/Observable";
import "rxjs/operator/do";
import "rxjs/operator/delay";
import { of } from "rxjs/observable/of";

// TODO: Implement OnPush strategy
@Component({
  selector: 'app-book-carousel',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  @Input('books') books$: Observable<Book[]>;
  @Output('details') details: EventEmitter<Book> = new EventEmitter();
  
  @ViewChild('host', { read: ViewContainerRef }) private host: ViewContainerRef;
  @ViewChild('listTemplate') private listTemplate: TemplateRef<any>;
  
  private books: Book[] = [];
  private listPortalHost: DomPortalHost;
  private carouselOptions: NgxSiemaOptions;
  private enableRender: Observable<boolean>;
  
  constructor( private appRef: ApplicationRef,
               private cfResolver: ComponentFactoryResolver,
               private injector: Injector,
               private carousel: NgxSiemaService ) {
  }
  
  ngOnInit() {
    if (this.host.element.nativeElement) {
      this.listPortalHost = new DomPortalHost(
        this.host.element.nativeElement,
        this.cfResolver,
        this.appRef,
        this.injector
      );
    }
    
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
    this.books$.subscribe(books => {
      this.books = books;
      
      this.generateList();
    });
  }
  
  generateList() {
    // generating carousel "on the fly" to overcome NgxSiema bug when content changed
    let listEV = this.listTemplate.createEmbeddedView({
      books: this.books,
      openDetails: this.openDetails,
      carouselOptions: this.carouselOptions,
      details: this.details
    });
    
    let listPortal = new TemplatePortal(
      this.listTemplate,
      this.host,
      listEV.context
    );
    
    if ( this.listPortalHost.hasAttached() ) {
      this.listPortalHost.detach();
    }
    
    // to make the carousel slides render properly we delay it until carousel rendered properly
    this.listPortalHost.attach(listPortal);
    this.enableRender = of(false, true).delay(10).do(val => console.log(val))
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
