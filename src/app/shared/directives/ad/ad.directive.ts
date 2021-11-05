import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare const ramp: any;
declare const googletag: any;

export interface AdItemData {
  id: string;
  slot?: string;
  size?: number[];
}

@Directive({
  selector: '[adItem]',
})
export class AdDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() id: string;
  @Input() type: 'gtag' | 'playwire';
  @Input() adUnit: string;
  @Input() pointer: string;
  @Input() author: string;

  constructor(
    private element: ElementRef,
  ) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    const adConfig = environment.showAds;
    if (
      adConfig.onArticlePage ||
      adConfig.onCategoryPage ||
      adConfig.onCharityPage ||
      adConfig.onCompanyPage ||
      adConfig.onFundraiserPage ||
      adConfig.onHomePage
    ) {
      if (this.type === 'playwire') {
        this.checkPlaywireAdScript(this.displayPlaywireAd.bind(this));
      } else {
        // sets ID attr in case it was escaped
        this.element.nativeElement.setAttribute('id', this.pointer);

        this.checkGoogleAdScript(() => {
          this.insertGTagAd();
        });
      }
    }
  }

  private insertGTagAd(): void {
    googletag.cmd.push(() => {
      const allGoogleAdSlots: { ref: any, data: AdItemData }[] = window['allGoogleAdSlots'];
      const slot = allGoogleAdSlots.find(item => item.data.id === this.pointer);

      if (slot) {
        if (this.author) {
          googletag.pubads().setTargeting("author", this.author);
        }

        googletag.display(this.pointer);
        googletag.pubads().refresh([slot.ref]);
      } else {
        console.log(`Slot was not found for ${this.pointer}`);
      }
    });
  }

  private displayPlaywireAd(): void {
    ramp.addUnits([
      {
        selectorId: this.id,
        type: this.adUnit || 'med_rect_atf'
      },
      // {
      //   type: 'bottom_rail'
      // },
    ]).then(() => {
      this.delay(500).subscribe(() => {
        ramp.displayUnits();
      });
    }).catch((e) => {
      this.delay(500).subscribe(() => {
        ramp.displayUnits();
      });

      // catch errors
      console.log('Error', e);
    });
  }

  private checkGoogleAdScript(cb: Function) {
    if (googletag?.apiReady) {
      this.delay(100).subscribe(() => {
        cb();
      });
    } else {
      this.delay(500).subscribe(() => {
        this.checkGoogleAdScript(cb);
      });
    }
  }

  private checkPlaywireAdScript(cb: Function) {
    if (ramp?.mtsInitialized) {
      this.delay(100).subscribe(() => {
        cb();
      });
    } else {
      console.log(`Ramp not ready yet... `, new Date());

      this.delay(1000).subscribe(() => {
        this.checkPlaywireAdScript(cb);
      });
    }
  }

  private delay(num: number): Observable<void> {
    return of(null).pipe(delay(num), take(1));
  }

  ngOnDestroy(): void {
    if (this.type === 'playwire') {
      // destroy
      if (ramp) {
        ramp.destroyUnits(this.adUnit);
      }
    } else {
      // destroy gtag for this spot
    }
  }
}
