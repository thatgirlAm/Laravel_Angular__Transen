import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AntiAuthGuard } from './anti-auth.guard';

describe('antiAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AntiAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
