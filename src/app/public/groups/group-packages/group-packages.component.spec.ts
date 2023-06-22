import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPackagesComponent } from './group-packages.component';

describe('GroupPackagesComponent', () => {
  let component: GroupPackagesComponent;
  let fixture: ComponentFixture<GroupPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
