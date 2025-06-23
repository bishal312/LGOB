import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUi } from './dialog-ui';

describe('DialogUi', () => {
  let component: DialogUi;
  let fixture: ComponentFixture<DialogUi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogUi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
