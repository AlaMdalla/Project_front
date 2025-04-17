import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListjobsadminComponent } from './listjobsadmin.component';

describe('ListjobsadminComponent', () => {
  let component: ListjobsadminComponent;
  let fixture: ComponentFixture<ListjobsadminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListjobsadminComponent]
    });
    fixture = TestBed.createComponent(ListjobsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
