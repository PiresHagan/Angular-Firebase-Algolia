import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleNetworkComponent } from './article-network.component';

describe('ArticleNetworkComponent', () => {
  let component: ArticleNetworkComponent;
  let fixture: ComponentFixture<ArticleNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArticleNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticleNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
