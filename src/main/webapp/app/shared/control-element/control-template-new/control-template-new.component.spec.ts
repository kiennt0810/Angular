import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlTemplateNewComponent } from './control-template-new.component';

describe('ControlTemplateNewComponent', () => {
  let component: ControlTemplateNewComponent;
  let fixture: ComponentFixture<ControlTemplateNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ControlTemplateNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ControlTemplateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
