import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDigitalSignPropComponent } from './image-digital-sign-prop.component';

describe('ImageDigitalSignPropComponent', () => {
  let component: ImageDigitalSignPropComponent;
  let fixture: ComponentFixture<ImageDigitalSignPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageDigitalSignPropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageDigitalSignPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
