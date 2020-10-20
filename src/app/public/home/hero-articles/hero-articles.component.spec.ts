import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroArticlesComponent } from './hero-articles.component';

describe('HeroArticlesComponent', () => {
  let component: HeroArticlesComponent;
  let fixture: ComponentFixture<HeroArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeroArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
