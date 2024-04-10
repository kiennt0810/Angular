import { AfterViewInit, Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FbMbusService } from '../../fb-mbus.service';
import { FeBaseDesign } from '../../fe-base-design.class';

@Component({
  selector: 'jhi-digital-sign-design',
  templateUrl: './digital-sign-design.component.html',
  styleUrls: ['./digital-sign-design.component.scss'],
})
export class DigitalSignDesignComponent extends FeBaseDesign implements OnInit, OnDestroy, AfterViewInit {
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
