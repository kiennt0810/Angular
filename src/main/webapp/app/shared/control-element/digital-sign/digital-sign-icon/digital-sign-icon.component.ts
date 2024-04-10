import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { isNullOrUndefined } from '../../../util/func-util';

@Component({
  selector: 'jhi-digital-sign-icon',
  templateUrl: './digital-sign-icon.component.html',
  styleUrls: ['./digital-sign-icon.component.scss'],
})
export class DigitalSignIconComponent implements OnInit {
  @Input() createdBy: 'coordinator' | 'requester' = 'requester';
  @ViewChild('icon', { static: true }) iconRef!: ElementRef;
  @Input() width: any;
  @Input() height: any;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {}
  onDragStart(e: any) {
    e.dataTransfer.setData('type', 'signature');
    e.dataTransfer.setData('createdBy', this.createdBy);
    e.dataTransfer.setData('subType', '2');
    const ratio = this.getClickPositionRatio(e.clientX, e.clientY);
    e.dataTransfer.setData('ratioX', ratio.x);
    e.dataTransfer.setData('ratioY', ratio.y);
    if (!isNullOrUndefined(this.width)) {
      e.dataTransfer.setData('templateWidth', this.width);
    } else {
      e.dataTransfer.setData('templateWidth', null);
    }
    if (!isNullOrUndefined(this.height)) {
      e.dataTransfer.setData('templateHeight', this.height);
    } else {
      e.dataTransfer.setData('templateHeight', null);
    }
  }
  getClickPositionRatio(x: number, y: number) {
    if (this.iconRef !== null) {
      const rect = this.iconRef.nativeElement.getBoundingClientRect();
      return { x: (x - rect.left) / rect.width, y: (y - rect.top) / rect.height };
    }
    return { x: 0.5, y: 0.5 };
  }
}
