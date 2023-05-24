import { TestBed } from '@angular/core/testing';

import { EntryAppService } from './entry-app.service';

describe('EntryAppService', () => {
  let service: EntryAppService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryAppService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
