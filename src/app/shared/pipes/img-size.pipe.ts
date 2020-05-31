import { Pipe, PipeTransform } from '@angular/core';
import * as firebase from 'firebase/app';
@Pipe({
  name: 'imgSize'
})
export class ImgSizePipe implements PipeTransform {

  async transform(value: unknown, ...args: unknown[]) {
    return await firebase.storage().refFromURL('gs://my-trending-stories-dev.appspot.com/test3/test4/resized_300_300_9.png');
  }

}
