import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleInteractionComponent } from './article-interaction.component';

describe('ArticleInteractionComponent', () => {
  let component: ArticleInteractionComponent;
  let fixture: ComponentFixture<ArticleInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
