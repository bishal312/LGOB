import { TestBed } from '@angular/core/testing';

import { DialogBox } from './dialog-box';

describe('DialogBox', () => {
  let service: DialogBox;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogBox);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
