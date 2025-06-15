import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCart } from './my-cart';

describe('MyCart', () => {
  let component: MyCart;
  let fixture: ComponentFixture<MyCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
