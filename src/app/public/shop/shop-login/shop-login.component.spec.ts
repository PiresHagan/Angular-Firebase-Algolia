import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopLoginComponent } from './shop-login.component';

describe('ShopLoginComponent', () => {
  let component: ShopLoginComponent;
  let fixture: ComponentFixture<ShopLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
