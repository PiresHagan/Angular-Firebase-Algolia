import { TestBed } from '@angular/core/testing';

import { SeoDataService } from './seo-data.service';

describe('SeoDataService', () => {
  let service: SeoDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeoDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
