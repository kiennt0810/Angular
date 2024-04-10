import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDigitalSignIconComponent } from './image-digital-sign-icon.component';

describe('ImageDigitalSignIconComponent', () => {
  let component: ImageDigitalSignIconComponent;
  let fixture: ComponentFixture<ImageDigitalSignIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageDigitalSignIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageDigitalSignIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
