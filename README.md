# HeroloLibrary

[Live Demo](https://ronnetzer.github.io/HeroloLib)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.5.0.

## Usage

This application uses NY Times API to fetch data. 
you'll need a key that you can get from [here](https://developer.nytimes.com/signup)

When you recieved your key just import the NYTModule and initialized it with the key
```html
import { NytApiModule } from './modules/nyt-api';
@NgModule({
  imports: [
    ...,
    NytApiModule.forRoot({ api_key: 'YOUR_API_KEY' })
  ],
  ....})
export class AppModule {}
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
