import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTVComponent } from './list-tv.component';

describe('ListTVComponent', () => {
  let component: ListTVComponent;
  let fixture: ComponentFixture<ListTVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTVComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
