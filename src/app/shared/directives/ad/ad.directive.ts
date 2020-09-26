import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

declare const $: any;

@Directive({
  selector: '[adItem]'
})
export class AdDirective implements OnInit {
  @Input() id: string;
  @Input() slot: string;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void {
    if (!this.id) {
      throw Error('Ad item ID must be specified');
    }

    if (!this.slot) {
      throw Error('Ad slot path must be specified');
    }

    this.checkAdScript(() => {
      const googletag = window['googletag'];

      googletag.cmd.push(() => {
        const elem = this.element.nativeElement;
        googletag.display(this.slot, [300, 250], elem);

        this.delay(2000).subscribe(() => {
          googletag.pubads().refresh(null, { changeCorrelator: false });

          console.log('Rendering Ad for ', this.id);
        });
      });
    });
  }

  private checkAdScript(cb: Function) {
    const script = window['googletag'];

    console.log('Script ', script);

    if (script) {
      cb();
    } else {
      this.delay(1000).subscribe(() => {
        this.checkAdScript(cb);
      });
    }
  }

  private delay(num: number): Observable<void> {
    return of(null).pipe(delay(num), take(1));
  }
}
