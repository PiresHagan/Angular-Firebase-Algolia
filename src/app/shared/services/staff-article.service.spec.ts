import { TestBed } from '@angular/core/testing';

import { StaffArticleService } from './staff-article.service';

describe('StaffArticleService', () => {
  let service: StaffArticleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaffArticleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
