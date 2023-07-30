import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPackageComponent } from './host-package.component';

describe('HostPackageComponent', () => {
  let component: HostPackageComponent;
  let fixture: ComponentFixture<HostPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HostPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
