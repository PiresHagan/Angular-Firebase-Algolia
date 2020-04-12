import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleSeoComponent } from './article-seo.component';

describe('ArticleSeoComponent', () => {
  let component: ArticleSeoComponent;
  let fixture: ComponentFixture<ArticleSeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleSeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
