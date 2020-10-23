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
  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.checkAdScript(() => {
      const googletag = window['googletag'];

      googletag.cmd.push(() => {
        googletag.display(this.element.nativeElement);
        googletag.pubads().refresh();
      });

      console.log(this.element.nativeElement);
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
