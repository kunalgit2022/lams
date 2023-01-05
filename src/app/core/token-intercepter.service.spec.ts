import { TestBed } from '@angular/core/testing';

import { TokenIntercepterService } from './token-intercepter.service';

describe('TokenIntercepterService', () => {
  let service: TokenIntercepterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenIntercepterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
