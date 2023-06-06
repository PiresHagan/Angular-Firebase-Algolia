import { TestBed } from '@angular/core/testing';

import { PoliticianService } from './politician.service';

describe('PoliticianService', () => {
  let service: PoliticianService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliticianService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
