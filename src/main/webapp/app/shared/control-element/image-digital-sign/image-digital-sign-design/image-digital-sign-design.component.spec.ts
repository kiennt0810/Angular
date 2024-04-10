import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDigitalSignDesignComponent } from './image-digital-sign-design.component';

describe('ImageDigitalSignDesignComponent', () => {
  let component: ImageDigitalSignDesignComponent;
  let fixture: ComponentFixture<ImageDigitalSignDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImageDigitalSignDesignComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageDigitalSignDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
