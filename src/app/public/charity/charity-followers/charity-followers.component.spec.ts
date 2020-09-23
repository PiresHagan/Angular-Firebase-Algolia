import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityFollowersComponent } from './charity-followers.component';

describe('CharityFollowersComponent', () => {
  let component: CharityFollowersComponent;
  let fixture: ComponentFixture<CharityFollowersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityFollowersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityFollowersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
