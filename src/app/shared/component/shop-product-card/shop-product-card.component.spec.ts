import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopProductCardComponent } from './shop-product-card.component';

describe('ShopProductCardComponent', () => {
  let component: ShopProductCardComponent;
  let fixture: ComponentFixture<ShopProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopProductCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopProductCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
