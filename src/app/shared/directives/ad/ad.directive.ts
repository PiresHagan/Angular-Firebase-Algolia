import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AdService } from '../../services/ad/ad.service';

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
    private adService: AdService,
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
        // sets ID attr in case it was escaped
        this.element.nativeElement.setAttribute('id', this.id);

        this.checkPlaywireAdScript(this.displayPlaywireAd.bind(this));
      } else {
        // sets ID attr in case it was escaped
        this.element.nativeElement.setAttribute('id', this.pointer);

        // this.checkGoogleAdScript(() => {
        //   this.insertGTagAd();
        // });
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

  private displayPlaywireAd(c = 0): void {
    if (c >= 50) {
      console.log(this);
      return;
    }

    if (!document.getElementById(this.id)) {
      this.adService.wait(500).then(() => {
        this.displayPlaywireAd(c + 1);
      });

      console.log(`Element with ID: ${this.id} not found for playwire ad`);
    } else {
      this.adService.displayAd(this.adUnit, this.id);
    }
  }

  private checkGoogleAdScript(cb: Function) {
    if (googletag?.apiReady) {
      this.adService.wait(100).then(() => {
        cb();
      });
    } else {
      this.adService.wait(500).then(() => {
        this.checkGoogleAdScript(cb);
      });
    }
  }

  private checkPlaywireAdScript(cb: Function) {
    if (ramp?.mtsInitialized) {
      this.adService.wait(100).then(() => {
        cb();
      });
    } else {
      console.log(`Ramp not ready yet... `, new Date());

      this.adService.wait(1000).then(() => {
        this.checkPlaywireAdScript(cb);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.type === 'playwire') {
      // destroy
      this.adService.removeAd(this.adUnit);
    } else {
      // destroy gtag for this spot
    }
  }
}
