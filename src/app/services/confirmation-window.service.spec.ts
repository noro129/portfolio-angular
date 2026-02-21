import { TestBed } from '@angular/core/testing';

import { ConfirmationWindowService } from './confirmation-window.service';

describe('ConfirmationWindowService', () => {
  let service: ConfirmationWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmationWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
