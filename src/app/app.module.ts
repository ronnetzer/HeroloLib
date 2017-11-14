import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

//#region Modules

// Material
import {
  MatIconModule,
  MatCardModule,
  MatExpansionModule,
  MatButtonModule,
  MatSnackBarModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatToolbarModule
} from '@angular/material';

// in memory web api
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

// carousel module (https://github.com/lexzhukov/ngx-siema)
import { NgxSiemaModule, NgxSiemaSlideComponent } from 'ngx-siema';

// NY Times API
import { NytApiModule } from './modules/nyt-api';
//#endregion

//#region Components
import { AppComponent } from './app.component';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { ListComponent } from './components/list/list.component';
import { BookModalComponent } from './modals/book-modal/book-modal.component';
//#endregion

import { BooksService } from './services/books.service';
import { InMemDataService } from './services/in-memory-api.service';
import { TitlePipe } from './pipes/title.pipe';

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    NytApiModule.forRoot({ api_key: '994995099a714dd79aac413d641cb6a1' }),
    HttpClientInMemoryWebApiModule.forRoot(InMemDataService, {delay: 700, passThruUnknownUrl: true }),
    NgxSiemaModule.forRoot()
  ],
  declarations: [
    AppComponent,
    ThumbnailComponent,
    ListComponent,
    TitlePipe,
    BookModalComponent
  ],
  entryComponents: [
    ThumbnailComponent,
    NgxSiemaSlideComponent,
    ListComponent,
    BookModalComponent
  ],
  providers: [
    TitlePipe,
    BooksService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
