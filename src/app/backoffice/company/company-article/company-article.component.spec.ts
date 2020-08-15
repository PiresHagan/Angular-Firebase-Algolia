import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyArticleComponent } from './company-article.component';

describe('CompanyArticleComponent', () => {
  let component: CompanyArticleComponent;
  let fixture: ComponentFixture<CompanyArticleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyArticleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
