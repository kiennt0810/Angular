import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FeBaseDesign } from '../../fe-base-design.class';
import { FbMbusService } from '../../fb-mbus.service';

@Component({
  selector: 'jhi-image-digital-sign-design',
  templateUrl: './image-digital-sign-design.component.html',
  styleUrls: ['./image-digital-sign-design.component.scss'],
})
export class ImageDigitalSignDesignComponent extends FeBaseDesign implements OnInit, OnDestroy, AfterViewInit {
  constructor(fbMbusService: FbMbusService, renderer: Renderer2) {
    super(fbMbusService, renderer);
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.destroy();
  }

  ngAfterViewInit() {
    this.initHandler();
  }
}
