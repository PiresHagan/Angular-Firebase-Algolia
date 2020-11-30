import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
@Pipe({
  name: 'imgSize'
})
export class ImgSizePipe implements PipeTransform {
  constructor(
    private storage: AngularFireStorage
  ) { }

  async transform(value: unknown, ...args: unknown[]) {
    return this.storage.storage.refFromURL('gs://my-trending-stories-dev.appspot.com/test3/test4/resized_300_300_9.png');
  }

}
