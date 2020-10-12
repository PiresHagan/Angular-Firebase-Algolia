import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

declare const $: any;

@Directive({
  selector: '[adItem]'
})
export class AdDirective implements OnInit, AfterViewInit {
  @Input() id: string;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void {
    if (!this.id) {
      throw Error('Ad item ID must be specified');
    }
  }

  ngAfterViewInit() {
    this.checkAdScript(() => {
      const googletag = window['googletag'];

      googletag.cmd.push(() => {
        googletag.display(this.id);
        googletag.pubads().refresh();
      });
    });
  }

  private checkAdScript(cb: Function) {
    const script = window['googletag'];

    if (script && script.apiReady) {
      this.delay(100).subscribe(() => {
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
