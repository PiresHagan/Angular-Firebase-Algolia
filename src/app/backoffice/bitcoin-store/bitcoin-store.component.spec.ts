import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BitcoinStoreComponent } from './bitcoin-store.component';

describe('BitcoinStoreComponent', () => {
  let component: BitcoinStoreComponent;
  let fixture: ComponentFixture<BitcoinStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BitcoinStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BitcoinStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
