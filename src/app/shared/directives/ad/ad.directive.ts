import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

declare const $: any;

export interface AdItemData {
  id: string;
  slot?: string;
}

@Directive({
  selector: '[adItem]'
})
export class AdDirective implements OnInit, AfterViewInit {
  @Input() id: string;
  @Input() pointer: string;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void {
    if (!this.id && !this.pointer) {
      throw Error('Ad item ID must be specified');
    }
  }

  ngAfterViewInit() {
    // sets ID attr in case it was escaped
    this.element.nativeElement.setAttribute('id', this.pointer || this.id);

    this.checkAdScript(() => {
      const googletag = window['googletag'];

      googletag.cmd.push(() => {
        googletag.display(this.id);
        googletag.pubads().refresh();
      });

      if (this.pointer) {
        console.log(this.element.nativeElement);
      }
    });
  }

  private checkAdScript(cb: Function) {
    const script = window['googletag'];

    if (script && script.apiReady) {
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
