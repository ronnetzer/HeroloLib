import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'title'
})
export class TitlePipe implements PipeTransform {
  
  /**
   * removes special chars and capitalize each word
   * @param value string to manipulate
   * @param args optional arguments
   * */
  transform( value: any, args?: any ): any {
    if ( value ) {
      // removing special chars => splitting to words => capitalize each word => join the sentence
      return value.replace(/[^A-Za-z() 0-9,'.]/g, '').split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      
    }
    return value;
  }
  
  
}
