import { DEFAULT_FIELD_SIZE, FieldType, FontType } from './enum.constants';
import { findRecipient, isNullOrUndefined } from '../util/func-util';
import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { FbMbusService } from './fb-mbus.service';
import { Subscription } from 'rxjs';
import { DragRef } from '@angular/cdk/drag-drop';

@Component({
  template: '',
})
export class FeBaseDesign {
  @ViewChild('container', { static: false }) containerRef: DragRef;
  @ViewChild('resizeBtn', { static: false }) resizeBtnRef: DragRef;
  @ViewChild('resizeDiv', { static: false }) resizeDivRef: ElementRef;
  // true when create lot or single
  isPreview = false;
  // editField
  public editField = true;
  // Id of the field
  public id: string;
  // type
  public type: string;
  // subType
  public subType: string;
  public listValues: any[] = [];
  // postion x
  public x: number;
  // position y
  public y: number;
  // // temp postion x
  // public _x: number;
  // // temp position y
  // public _y: number;
  // width of field
  public w: number;
  // height of field
  public h: number;
  // page number container field
  public page = 1;
  // zoom ratio
  public zoom = 1;
  // top of page
  public pt: number;
  // viewport width
  public vw: number;
  // view port left
  public vl: number;
  // page width
  public pw: number;
  // page height
  public ph: number;
  // field is selected
  public actived = false;
  // in mode resize
  public resizing = false;
  // recipient
  public recipient: any;
  // envelope
  private envelope: any;

  fontFamilySelectField = 'Times New Roman';
  fontSizeSelectField = 14;
  isBoldSelectField = false;
  isItalicSelectField = false;
  radioBtnDirection = 'vertical';
  radioBtnListValue = [];
  textColor = '0,0,0';

  // subscription to event
  private viewportSub: Subscription;
  private containerSub: Subscription;
  private resizeBtnMoveSub: Subscription;
  private resizeBtnEndSub: Subscription;
  private selectedSub: Subscription;
  private fieldValueChangedSub: Subscription;

  public fbMbusService: FbMbusService;
  public renderer: Renderer2;

  constructor(fbMbusService: FbMbusService, renderer: Renderer2) {
    this.fbMbusService = fbMbusService;
    this.renderer = renderer;
    this.envelope = this.fbMbusService.getEnvelope();
    this.viewportSub = this.fbMbusService.viewportInfo().subscribe(this.viewportChanged);
    this.selectedSub = this.fbMbusService.fieldSelected().subscribe(this.checkSelected);
    this.fieldValueChangedSub = this.fbMbusService.fieldValueChangedFromProp().subscribe(this.changeFieldValue);
  }

  public destroy() {
    this.id = null;
    if (this.viewportSub != null) {
      this.viewportSub.unsubscribe();
      this.viewportSub = null;
    }

    if (this.containerSub != null) {
      this.containerSub.unsubscribe();
      this.containerSub = null;
    }
    if (this.resizeBtnMoveSub != null) {
      this.resizeBtnMoveSub.unsubscribe();
      this.resizeBtnMoveSub = null;
    }
    if (this.resizeBtnEndSub != null) {
      this.resizeBtnEndSub.unsubscribe();
      this.resizeBtnEndSub = null;
    }
    if (this.selectedSub != null) {
      this.selectedSub.unsubscribe();
      this.selectedSub = null;
    }
    if (this.fieldValueChangedSub != null) {
      this.fieldValueChangedSub.unsubscribe();
      this.fieldValueChangedSub = null;
    }
  }

  //
  public changeFieldValue = v => {
    if (v.id === this.id && !isNullOrUndefined(v.value) && !isNullOrUndefined(v.value.fieldBox)) {
      v.value.fieldBox.x = Math.floor(v.value.fieldBox.x);
      v.value.fieldBox.y = Math.floor(v.value.fieldBox.y);
      this.x = v.value.fieldBox.x;
      this.y = v.value.fieldBox.y;
      this.w = v.value.fieldBox.w;
      this.h = v.value.fieldBox.h;

      this.setPosition(this.containerRef.getRootElement(), this.dy(), this.dx());
      this.setSize(this.containerRef.getRootElement(), this.dw(), this.dh());
      // find field's recipient
      if (!isNullOrUndefined(v.value.recipientId)) {
        this.recipient = findRecipient(v.value.recipientId, this.envelope);
      }
    }
  };

  // changeFieldPositionHandle() {
  //   this.containerRef.moved.subscribe(res => {
  //     const field = { ...this.fbMbusService.getField(this.id) };
  //     if (!isNullOrUndefined(field.subFieldBox)) {
  //       const _x = this.x + res.distance.x / this.zoom;
  //       const _y = this.y + res.distance.y / this.zoom;
  //       if (_x > 0 && _x + +this.w < this.pw && _y > 0 && _y + +this.h < this.ph) {
  //         this.x = _x;
  //         this.y = _y;
  //         this.setPosition(this.containerRef.getRootElement(), this.dy(), this.dx());
  //         this.fireChangeValue();
  //       }
  //       this.containerRef.reset();
  //       field.fieldBox = { x: +this.x, y: +this.y, w: +this.w, h: +this.h };
  //       // this.fbMbusService.changeFieldValueFromDesign(field);
  //       this.fbMbusService.setCommentFieldPosChange(field);
  //     }
  //   });
  // }

  // Check if the selected event fired
  public checkSelected = (v: any) => {
    if (v.value == null) {
      this.actived = false;
      return;
    }
    if (this.id !== v.value.id) {
      this.actived = false;
    } else {
      this.actived = true;
    }
  };

  public viewportChanged = (v: any) => {
    this.vw = v.width;
    this.zoom = v.zoom;
    this.vl = v.left;
  };

  public marginLeft() {
    const ret = (this.vw - this.pw * this.zoom) / 2;
    return ret > 0 ? ret : 7; // padding of the container
  }

  dx() {
    return this.marginLeft() + this.x * this.zoom;
  }

  dy() {
    return (this.pt + this.y) * this.zoom;
  }

  dw() {
    return +this.w * this.zoom;
  }

  dh() {
    return +this.h * this.zoom;
  }

  setPosition(elm: any, top: number, left: number) {
    this.renderer.setStyle(elm, 'top', top + 'px');
    this.renderer.setStyle(elm, 'left', left + 'px');
  }

  setSize(elm: any, w: number, h: number) {
    if (this.type === FieldType.CHECKBOX) {
      if (h > w) {
        w = h;
      } else if (w > h) {
        h = w;
      }
    }

    this.renderer.setStyle(elm, 'width', w + 'px');
    this.renderer.setStyle(elm, 'height', h + 'px');
  }

  fieldMouseDown(e: any) {
    this.fbMbusService.selectField(this.id);
    this.actived = true;
    e.stopPropagation();
    e.preventDefault();
  }

  fieldMouseDownWithoutPreventDefault(e: any) {
    this.fbMbusService.selectField(this.id);
    this.actived = true;
    e.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any) {
    if (!isNullOrUndefined(this.containerRef) && this.containerRef.getRootElement().contains(event.target)) {
      this.actived = true;
      this.fbMbusService.selectField(this.id);
    } else {
      this.actived = false;
      this.fbMbusService.unSelectField(this.id);
    }
  }

  removeClick(e: any) {
    e.preventDefault();
    e.stopPropagation();
    this.fbMbusService.deleteField(this.id);
  }

  initHandler() {
    this.containerSub = this.containerRef.ended.subscribe(this.containerHandler);
    if (!this.isPreview && this.editField) {
      if (!isNullOrUndefined(this.resizeBtnRef)) {
        this.resizeBtnMoveSub = this.resizeBtnRef.moved.subscribe(this.resizeBtnMoveHandler);
        this.resizeBtnEndSub = this.resizeBtnRef.ended.subscribe(this.resizeBtnEndHandler);
      }
    }
  }

  containerHandler = v => {
    const _x = this.x + v.distance.x / this.zoom;
    const _y = this.y + v.distance.y / this.zoom;
    console.log('movinggg');
    if (_x > 0 && _x + +this.w < this.pw && _y > 0 && _y + +this.h < this.ph) {
      this.x = _x;
      this.y = _y;
      this.setPosition(this.containerRef.getRootElement(), this.dy(), this.dx());
      this.fireChangeValue();
    }
    this.containerRef.reset();
  };

  resizeBtnMoveHandler = obj => {
    const _elm: HTMLElement = this.resizeDivRef.nativeElement;
    if (_elm) {
      this.setSize(_elm, +this.w * this.zoom + obj.distance.x, +this.h * this.zoom + obj.distance.y);
    }
  };

  resizeBtnEndHandler = obj => {
    const _elm: HTMLElement = this.resizeDivRef.nativeElement;
    if (_elm) {
      let _h = +this.h + obj.distance.y / this.zoom;
      let _w = +this.w + obj.distance.x / this.zoom;

      if (this.type === FieldType.CHECKBOX) {
        if (_h > _w) {
          _w = _h;
        } else if (_w > _h) {
          _h = _w;
        }
      }

      if (_h > DEFAULT_FIELD_SIZE[this.type].h && _w > DEFAULT_FIELD_SIZE[this.type].w && _h + this.y < this.ph && _w + this.x < this.pw) {
        this.setSize(_elm, +this.w * this.zoom + obj.distance.x, +this.h * this.zoom + obj.distance.y);
        this.h = _h;
        this.w = _w;
        this.setSize(this.containerRef.getRootElement(), this.dw(), this.dh());
        this.fireChangeValue();
      }
    }
    this.resetResizeBtnRef();
  };

  resizeDown(e: any) {
    this.resizing = true;
  }

  resizeUp(e: any) {
    this.resizing = false;
  }

  resetResizeBtnRef() {
    this.resizeBtnRef.reset();
    this.renderer.removeAttribute(this.resizeBtnRef.getRootElement(), 'transform');
    this.setSize(this.resizeDivRef.nativeElement, this.dw(), this.dh());
  }

  fireChangeValue() {
    const field = { ...this.fbMbusService.getField(this.id) };
    field.fieldBox = { x: +this.x, y: +this.y, w: +this.w, h: +this.h };
    if (field.type === FieldType.SELECT) {
      field.listValues = this.listValues;
    }
    this.fbMbusService.changeFieldValueFromDesign(field);
  }

  // copyField() {
  //   this.fbMbusService.setFieldCopy(this.id);
  // }
}
