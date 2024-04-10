import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isNullOrUndefined } from '../../../util/func-util';

@Component({
  selector: 'jhi-image-digital-sign-icon',
  templateUrl: './image-digital-sign-icon.component.html',
  styleUrls: ['./image-digital-sign-icon.component.scss'],
})
export class ImageDigitalSignIconComponent implements OnInit {
  @Input() createdBy: 'coordinator' | 'requester' = 'requester';
  @ViewChild('icon', { static: true }) iconRef!: ElementRef;

  @Input() width: any;
  @Input() height: any;

  language!: string;
  constructor(private renderer: Renderer2, private translateService: TranslateService) {}

  ngOnInit() {
    this.translateService.get('home.title').subscribe(res => {
      if (res === 'Welcome to FPT.eContract!') {
        this.language = 'en';
      } else {
        this.language = 'vi';
      }
    });
  }
  onDragStart(e: any) {
    e.dataTransfer.setData('type', 'signature');
    // '1': image signature
    // '2': digital signature
    // '3': image-digital signature
    e.dataTransfer.setData('createdBy', this.createdBy);
    e.dataTransfer.setData('subType', '3');
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
