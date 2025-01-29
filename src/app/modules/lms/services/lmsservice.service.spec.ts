import { TestBed } from '@angular/core/testing';

import { LmsserviceService } from './lmsservice.service';

describe('LmsserviceService', () => {
  let service: LmsserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LmsserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
