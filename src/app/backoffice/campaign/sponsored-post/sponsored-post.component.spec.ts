import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsoredPostComponent } from './sponsored-post.component';

describe('SponsoredPostComponent', () => {
  let component: SponsoredPostComponent;
  let fixture: ComponentFixture<SponsoredPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
