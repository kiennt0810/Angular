import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuocgiavavunglanhthoComponent } from './quocgiavavunglanhtho.component';

describe('QuocgiavavunglanhthoComponent', () => {
  let component: QuocgiavavunglanhthoComponent;
  let fixture: ComponentFixture<QuocgiavavunglanhthoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuocgiavavunglanhthoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuocgiavavunglanhthoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
