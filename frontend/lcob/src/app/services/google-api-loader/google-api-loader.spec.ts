import { TestBed } from '@angular/core/testing';

import { GoogleApiLoader } from './google-api-loader';

describe('GoogleApiLoader', () => {
  let service: GoogleApiLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleApiLoader);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
