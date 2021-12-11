import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay, take } from 'rxjs/operators';

declare const ramp: any;

@Injectable({
  providedIn: 'root'
})
export class AdService {
  constructor() { }

  public wait(num: number): Promise<void> {
    return of(null).pipe(delay(num), take(1)).toPromise();
  }

  public displayAd(type: string, selectorId?: string): Promise<void> {
    console.log(`Displaying ad ${type} and selector: ${selectorId}`);

    return new Promise(resolve => {
      ramp.addUnits([
        {
          selectorId: selectorId,
          type: type,
        }
      ]).then(() => {
        this.wait(500).then(() => {
          ramp.displayUnits();
        });

        console.log(ramp.getUnits());

        resolve();
      }).catch((e) => {
        this.wait(500).then(() => {
          ramp.displayUnits();
        });

        // catch errors
        console.log('Error', e);
        resolve();
      });
    });
  }

  public removeAd(unit: string): void {
    if (ramp) {
      ramp.destroyUnits([unit]);
    }
  }

  public async displayBottomRailAd(): Promise<void> {
    if (ramp?.mtsInitialized) {
      return this.displayAd('bottom_rail');
    } else {
      await this.wait(500);

      return this.displayBottomRailAd();
    }
  }

  public removeBottomRailAd(): void {
    this.removeAd('bottom_rail');
  }
}
