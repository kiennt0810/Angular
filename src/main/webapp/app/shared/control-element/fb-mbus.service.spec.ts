import { TestBed } from '@angular/core/testing';

import { FbMbusService } from './fb-mbus.service';

describe('FbMbusService', () => {
  let service: FbMbusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FbMbusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
