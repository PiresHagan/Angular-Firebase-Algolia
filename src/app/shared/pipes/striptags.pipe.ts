import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripTags'
})
export class StripTagsPipe implements PipeTransform {

  transform(text: string, ...usefulTags: any[]): string {
    return usefulTags.length > 0
      ? text.replace(new RegExp(`<(?!\/?(${usefulTags.join('|')})\s*\/?)[^>]+>`, 'g'), '')
      : text.replace(/<(?:.|\s)*?>/g, '');
  }

}
