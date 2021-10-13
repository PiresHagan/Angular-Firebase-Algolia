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
  @Input() id: string;
  @Input() type: 'gtag' | 'playwire';
  @Input() adUnit: string;
  @Input() pointer: string;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    if (this.type === 'playwire') {
      this.checkPlaywireAdScript(this.displayPlaywireAd.bind(this));
    } else {
      this.checkAdScript(() => {
        const googletag = window['googletag'];

        googletag.cmd.push(() => {
          googletag.display(this.pointer);
          googletag.pubads().refresh();
        });
      });
    }
  }

  private displayPlaywireAd(): void {
    const tyche = window['tyche'];

    tyche.addUnits([
      {
        selectorId: this.id,
        type: this.adUnit || 'med_rect_atf'
      },
      // {
      //   type: 'bottom_rail'
      // },
    ]).then(() => {
      this.delay(500).subscribe(() => {
        tyche.displayUnits();
      });

      console.log(`Displaying ${this.id} ad units`);
    }).catch((e) => {
      // catch errors
      console.log(e);
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

  private checkPlaywireAdScript(cb: Function) {
    const script = window['tyche'];

    if (script && script.initialized) {
      this.delay(100).subscribe(() => {
        cb();
      });
    } else {
      this.delay(500).subscribe(() => {
        this.checkPlaywireAdScript(cb);
      });
    }
  }

  private delay(num: number): Observable<void> {
    return of(null).pipe(delay(num), take(1));
  }
}
