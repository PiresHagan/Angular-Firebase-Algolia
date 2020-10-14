import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bitcoin-store',
  templateUrl: './bitcoin-store.component.html',
  styleUrls: ['./bitcoin-store.component.scss']
})
export class BitcoinStoreComponent implements OnInit {
  successCopyTxt: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    this.successCopyTxt= true;
    setTimeout(() => {
      this.successCopyTxt = false;
    }, 2000);
  }
}
