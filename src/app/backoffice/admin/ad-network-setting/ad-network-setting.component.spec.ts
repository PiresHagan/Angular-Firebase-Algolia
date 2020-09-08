import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdNetworkSettingComponent } from './ad-network-setting.component';

describe('AdNetworkSettingComponent', () => {
  let component: AdNetworkSettingComponent;
  let fixture: ComponentFixture<AdNetworkSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdNetworkSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdNetworkSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
