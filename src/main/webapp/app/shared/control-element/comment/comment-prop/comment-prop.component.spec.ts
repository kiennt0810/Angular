import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentPropComponent } from './comment-prop.component';

describe('CommentPropComponent', () => {
  let component: CommentPropComponent;
  let fixture: ComponentFixture<CommentPropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommentPropComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentPropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
