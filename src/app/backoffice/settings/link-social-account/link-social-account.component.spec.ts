import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkSocialAccountComponent } from './link-social-account.component';

describe('LinkSocialAccountComponent', () => {
  let component: LinkSocialAccountComponent;
  let fixture: ComponentFixture<LinkSocialAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkSocialAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkSocialAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
