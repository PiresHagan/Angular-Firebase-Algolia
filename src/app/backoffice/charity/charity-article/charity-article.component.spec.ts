import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityArticleComponent } from './charity-article.component';

describe('CharityArticleComponent', () => {
  let component: CharityArticleComponent;
  let fixture: ComponentFixture<CharityArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharityArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharityArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
