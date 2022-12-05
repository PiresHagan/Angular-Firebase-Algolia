import { TestBed } from '@angular/core/testing';

import { RestrictProfileGuard } from './restrict-profile.guard';

describe('RestrictProfileGuard', () => {
  let guard: RestrictProfileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RestrictProfileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
