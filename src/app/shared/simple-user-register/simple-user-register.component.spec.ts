import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleUserRegisterComponent } from './simple-user-register.component';

describe('SimpleUserRegisterComponent', () => {
  let component: SimpleUserRegisterComponent;
  let fixture: ComponentFixture<SimpleUserRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleUserRegisterComponent]
    });
    fixture = TestBed.createComponent(SimpleUserRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
