import { TestBed } from '@angular/core/testing';

import { PadletAppService } from './padlet-app.service';

describe('PadletAppService', () => {
  let service: PadletAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PadletAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
