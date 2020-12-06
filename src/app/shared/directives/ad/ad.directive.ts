import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

declare const $: any;

export interface AdItemData {
  id: string;
  slot?: string;
  size?: number[];
}

@Directive({
  selector: '[adItem]'
})
export class AdDirective implements OnInit, AfterViewInit {
  @Input() pointer: string;
  @Input() author: string;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void {
    if (!this.pointer) {
      throw Error('Ad item ID must be specified');
    }
  }

  ngAfterViewInit() {
    // sets ID attr in case it was escaped
    this.element.nativeElement.setAttribute('id', this.pointer);

    this.checkAdScript(() => {
      this.insertAd();
    });
  }

  private insertAd(): void {
    const googletag = window['googletag'];

    googletag.cmd.push(() => {
      const allGoogleAdSlots: { ref: any, data: AdItemData }[] = window['allGoogleAdSlots'];
      const slot = allGoogleAdSlots.find(item => item.data.id === this.pointer);

      if (slot) {
        if(this.author){
          googletag.pubads().setTargeting("author", this.author);
          console.log('Author key pair', this.author);
        }
        googletag.display(this.pointer);
        googletag.pubads().refresh([slot.ref]);
      } else {
        console.log(`Slot was not found for ${this.pointer}`);
        console.log(allGoogleAdSlots);
      }
    });
  }

  private checkAdScript(cb: Function) {
    const script = window['googletag'];

    if (script && script.apiReady && window['allGoogleAdSlots']) {
      this.delay(1000).subscribe(() => {
        cb();
      });
    } else {
      this.delay(500).subscribe(() => {
        this.checkAdScript(cb);
      });
    }
  }

  private delay(num: number): Observable<void> {
    return of(null).pipe(delay(num), take(1));
  }
}
