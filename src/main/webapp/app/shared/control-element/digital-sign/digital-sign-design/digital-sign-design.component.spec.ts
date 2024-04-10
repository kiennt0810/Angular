import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSignDesignComponent } from './digital-sign-design.component';

describe('DigitalSignDesignComponent', () => {
  let component: DigitalSignDesignComponent;
  let fixture: ComponentFixture<DigitalSignDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DigitalSignDesignComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DigitalSignDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
