import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityFollowerListComponent } from './charity-follower-list.component';

describe('CharityFollowerListComponent', () => {
  let component: CharityFollowerListComponent;
  let fixture: ComponentFixture<CharityFollowerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityFollowerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityFollowerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
