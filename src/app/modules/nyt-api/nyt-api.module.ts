import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { NYTBooksService, CONFIG_TOKEN ,Config } from "./nyt-books.service";

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [],
  exports: []
})
export class NytApiModule {
  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: NytApiModule,
      providers: [NYTBooksService, { provide: CONFIG_TOKEN, useValue: config }]
    }
  }
}
