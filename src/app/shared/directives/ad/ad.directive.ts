import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare const ramp: any;

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

  ngOnInit(): void {
    console.log(this);
  }

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
          console.log('Google ad scripts are ready...');
          // this.insertGTagAd();
        });
      }
    }
  }

  private insertGTagAd(): void {
    const googletag = window['googletag'];

    googletag.cmd.push(() => {
      const allGoogleAdSlots: { ref: any, data: AdItemData }[] = window['allGoogleAdSlots'];
      const slot = allGoogleAdSlots.find(item => item.data.id === this.pointer);

      if (slot) {
        if (this.author) {
          googletag.pubads().setTargeting("author", this.author);
          // console.log('Author key pair', googletag.pubads().getTargeting('author'));

        }
        googletag.display(this.pointer);
        googletag.pubads().refresh([slot.ref]);
      } else {
        // console.log(`Slot was not found for ${this.pointer}`);
        // console.log(allGoogleAdSlots);
      }
    });
  }

  private displayPlaywireAd(): void {
    // const ramp = window['ramp'];

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

      console.log(`Displaying ${this.id} ad units`);

      console.log(ramp.getUnits());
    }).catch((e) => {
      this.delay(500).subscribe(() => {
        ramp.displayUnits();
      });

      // catch errors
      console.log('Error', e);
    });
  }

  private checkGoogleAdScript(cb: Function) {
    const script = window['googletag'];

    if (script && script.apiReady) {
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
    const script = window['ramp'];

    console.log(ramp, script);

    if (script?.mtsInitialized) {
      this.delay(100).subscribe(() => {
        cb();
      });
    } else {
      console.log(`Ramp not read... `, new Date());

      this.delay(500).subscribe(() => {
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
      const script = window['ramp'];

      if (script) {
        script.destroyUnits(this.adUnit);
      }
    } else {
      // destroy gtag for this spot
    }
  }
}
