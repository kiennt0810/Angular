import { Injectable } from '@angular/core';
import { Guid, isNullOrUndefined } from '../util/func-util';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { FieldType, LAYOUT_FIELD_SIZE } from './enum.constants';
import { Field } from '../model/field.model';

@Injectable({
  providedIn: 'root',
})
export class FbMbusService {
  // Contain all field added in the pdf
  private _allFields: Map<string, Field> | null = new Map<string, Field>();
  // store size of all pdf pages
  private _pageSizes: { width: number; height: number; top: number }[] = [];
  // Subject to fire the event of selected field in the pdf doc
  private $_fieldSelected: ReplaySubject<{ type: string; value: Field }> = new ReplaySubject<{ type: string; value: Field }>(1);
  // Subject to fire the event of change value of field in the pdf doc from design
  private $_fieldValueChangedFromDesign: Subject<{ id: string; value: Field }> = new Subject<{ id: string; value: Field }>();
  // Subject to fire the event of change value of field in the pdf doc
  private $_fieldValueChangedFromProp: Subject<{ id: string; value: Field }> = new Subject<{ id: string; value: Field }>();
  // Subject to fire the event of deleted field in the pdf doc
  private $_fieldDeleted: Subject<string> = new Subject<string>();
  // Subject to fire the event of viewport change field in the pdf doc
  // example windows change size
  private $_viewportInfo: ReplaySubject<{ top: number; left: number; width: number; height: number; zoom: number }> = new ReplaySubject<{
    top: number;
    left: number;
    width: number;
    height: number;
    zoom: number;
  }>(1);

  private $_fieldCopy: Subject<{ id: string; value: Field; pageList: any[] }> = new Subject<{
    id: string;
    value: Field;
    pageList: any[];
  }>();
  private $_pageList = new BehaviorSubject([]);

  // font style list for previewing name control
  private fontStylePreviewMap: Map<string, string> = new Map<string, string>();

  // Contain envelop information
  private envelope: any;
  // Contain current selected field;
  private _selectedField: Field | null = null;

  private $_commentFieldPosChanged: Subject<{ id: string; value: Field }> = new Subject<{ id: string; value: Field }>();
  checkboxCheckedImage =
    'data:image/png;base64,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';
  checkboxUncheckImage =
    'data:image/png;base64,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';

  constructor(private languageService: TranslateService) {}

  // Get all the fields in the pdf doc
  public getAllFields(): Map<string, Field> {
    return this._allFields;
  }

  public getField(id: string): Field | null {
    if (this._allFields !== null) {
      return this._allFields.get(id);
    }
    return null;
  }

  public updateField(id: string, value: any) {
    if (!isNullOrUndefined(this._allFields)) {
      this._allFields.set(id, value);
    }
  }

  // Set the page size of all the pdf doc's pages
  public setPageSizes(value: { width: number; height: number; top: number }[]) {
    this._pageSizes = value;
  }

  // Get page size of given index start of 1
  public getPageSize(index: number): { width: number; height: number; top: number } | null {
    if (this._pageSizes !== null && this._pageSizes.length >= index && index > 0) {
      return this._pageSizes[index - 1];
    }
    return null;
  }

  /**
   * Create new field with some field information like
   * docId: Document id
   * type: Type of the field
   * page: Pdf page number
   * x,y: Postion in the pdf page
   * And some other informatios to adjuste the postion of field
   **/

  // TODO
  public createNewField(
    _docId: string,
    _type: FieldType,
    _createdBy: string,
    _subType: string,
    _page: number,
    _x: number,
    _y: number,
    _pWidth: number,
    _pHeight: number,
    _ratio: any,
    _validators: any[],
    _templateSize: any,
    // leftbar comment
    _value?: any,
    _createdDate?: any,
    _recipientId?: any,
    _color?: any,
    _templateConfig?: any
  ): Field {
    const _id = Guid.get().toString();
    let _size: { h: number; w: number };
    if (!isNullOrUndefined(_templateSize)) {
      if (
        !isNullOrUndefined(_templateSize.w) &&
        _templateSize.w !== 'null' &&
        !isNullOrUndefined(_templateSize.h) &&
        _templateSize.h !== 'null'
      ) {
        _size = _templateSize;
      } else {
        _size = LAYOUT_FIELD_SIZE[_type];
      }
    } else {
      _size = LAYOUT_FIELD_SIZE[_type];
    }

    _x = _x - +_size.w * _ratio.x > 0 ? _x - +_size.w * _ratio.x : 0;
    _x = _x + +_size.w > _pWidth ? _pWidth - +_size.w : _x;
    _y = _y - +_size.h * _ratio.y > 0 ? _y - +_size.h * _ratio.y : 0;
    _y = _y + +_size.h > _pHeight ? _pHeight - +_size.h : _y;

    const ret: Field = {
      id: _id,
      name: _id,
      type: _type,
      createdBy: _createdBy,
      subType: _subType,
      page: _page,
      docId: _docId,
      fieldBox: { x: _x, y: _y, w: _size.w, h: _size.h },
      validators: _validators,
      fieldDesign: {},
      transparent: false,
      visibleSignature: '',
      createdDate: _type === FieldType.COMMENT ? +_createdDate : null,
      recipientId: _recipientId,
      color: !isNullOrUndefined(_color) ? _color : null,
    };
    // leftbar comment
    if (_type === FieldType.COMMENT) {
      ret.value = _value;
      ret.publish = false;
    }

    this._allFields.set(_id, ret);
    this._selectedField = ret;
    this.$_fieldSelected.next({ type: _type, value: ret });
    return ret;
  }

  /**
   * Delete the field with given id and fire deleted field event
   */
  public deleteField(id: string) {
    this.$_fieldDeleted.next(id);
    this._allFields.delete(id);
    this.unSelectField(id);
  }

  /**
   * Selected a field
   * @param id given id of the field
   */
  public selectField(id: string) {
    this._selectedField = this._allFields.get(id);
    if (!isNullOrUndefined(this._selectedField)) {
      if (this._selectedField.type !== 'comment') {
        this.$_fieldSelected.next({ type: this._selectedField.type, value: this._selectedField });
      }
    }
  }

  /**
   * Un selected the field
   * @param id
   */
  public unSelectField(id?: string) {
    if (!isNullOrUndefined(this._selectedField)) {
      if (this._selectedField.id === id) {
        this._selectedField = null;
        this.$_fieldSelected.next({ type: null, value: null });
      }
    }
  }

  /**
   * Change value of the field and fire event change
   */
  public changeFieldValueFromDesign(field: Field) {
    if (field != null && !isNullOrUndefined(field.id)) {
      this._allFields.set(field.id, field);
      this.$_fieldValueChangedFromDesign.next({ id: field.id, value: field });
    }
  }

  public changeFieldValueFromProp(field: Field) {
    if (field != null && !isNullOrUndefined(field.id)) {
      this._allFields.set(field.id, field);
      this.$_fieldValueChangedFromProp.next({ id: field.id, value: field });
    }
  }

  /**
   * Fire viewport information change
   * @param value
   */
  public setViewportInfo(value: { top: number; left: number; width: number; height: number; zoom: number }) {
    this.$_viewportInfo.next(value);
  }

  /*
   * Fire event when field selected
   */
  public fieldSelected(): Observable<{ type: string; value: Field }> {
    return this.$_fieldSelected.asObservable();
  }

  /**
   * Fire event when user change the value of the field postition from drag and drop
   */
  public fieldValueChangedFromProp(): Observable<{ id: string; value: Field }> {
    return this.$_fieldValueChangedFromProp.asObservable();
  }

  /**
   *  Fire event when user change the value of the field from input in the properties screen
   */
  public fieldValueChangedFromDesign(): Observable<{ id: string; value: Field }> {
    return this.$_fieldValueChangedFromDesign.asObservable();
  }

  /**
   * Fire event when field delete
   */
  public fieldDeleted(): Observable<string> {
    return this.$_fieldDeleted.asObservable();
  }

  /**
   * Fire event when viewport change
   */
  public viewportInfo() {
    return this.$_viewportInfo.asObservable();
  }

  public setEnvelope(v: any) {
    this.envelope = v;
  }

  public getEnvelope() {
    return this.envelope;
  }

  public isAllFieldValids() {
    let ret = true;
    this._allFields.forEach((v, k) => {
      if (v.type !== FieldType.COMMENT && v.type !== FieldType.SELECT) {
        ret = ret && v.valid;
      }
    });
    return ret;
  }

  public addField(field: any) {
    if (!isNullOrUndefined(field)) {
      this._allFields.set(field.id, field);
    }
  }

  public clear() {
    this._allFields.clear();
    this._selectedField = null;
    delete this._pageSizes;
    this._pageSizes = [];
  }

  public setFontStylePreviewList(id: string, fontName: string) {
    this.fontStylePreviewMap.set(id, fontName);
  }

  public getFontStylePreviewById(id: string) {
    return this.fontStylePreviewMap.get(id);
  }

  public setCommentFieldPosChange(field: any) {
    this.$_commentFieldPosChanged.next({ id: field.id, value: field });
  }

  public getCommentFieldPosChange(): Observable<any> {
    return this.$_commentFieldPosChanged.asObservable();
  }

  public setFieldCopy(id, pageList: any[]) {
    this._selectedField = this._allFields.get(id);
    if (!isNullOrUndefined(this._selectedField)) {
      this.$_fieldCopy.next({ id: id, value: this._selectedField, pageList: pageList });
    }
  }

  public getFieldCopy() {
    return this.$_fieldCopy.asObservable();
  }

  public setPageList(pageList: any[]) {
    this.$_pageList.next(pageList);
  }

  public getPageList() {
    return this.$_pageList.asObservable();
  }
}
