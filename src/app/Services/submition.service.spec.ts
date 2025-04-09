import { TestBed } from '@angular/core/testing';

import { SubmitionService } from './submition.service';

describe('SubmitionService', () => {
  let service: SubmitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
