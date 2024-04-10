import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Field } from '../../../model/field.model';
import { FbMbusService } from '../../fb-mbus.service';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DEFAULT_FIELD_SIZE, FieldType, ValidatorType } from '../../enum.constants';
import { getSigners, isNullOrUndefined, isNumber } from '../../../util/func-util';

@Component({
  selector: 'jhi-image-digital-sign-prop',
  templateUrl: './image-digital-sign-prop.component.html',
  styleUrls: ['./image-digital-sign-prop.component.scss'],
})
export class ImageDigitalSignPropComponent implements OnInit {
  @Input() data: Field;
  private fieldValueChangedSub: Subscription;
  private minSub: Subscription;
  private lenSub: Subscription;
  private xSub: Subscription;
  private ySub: Subscription;
  private wSub: Subscription;
  private hSub: Subscription;
  private fSub: Subscription;
  private pageSize = null;
  x: number;
  y: number;
  h: number;
  w: number;
  f: FormGroup;
  envelope;
  constructor(private fbMbusService: FbMbusService, private fb: FormBuilder) {
    this.fieldValueChangedSub = this.fbMbusService.fieldValueChangedFromDesign().subscribe(this.changeFieldValue);
    this.envelope = this.fbMbusService.getEnvelope();
    this.f = this.fb.group({
      id: [''],
      name: ['', { validators: [Validators.required, Validators.pattern('^[a-zA-Z0-9]+([ _.]?[a-zA-Z0-9])*$')], updateOn: 'blur' }],
      imageSignature: [true],
      digitalSignature: [false],
      required: [false],
      email: [false],
      value: [false],
      min: [''],
      max: [''],
      length: [false],
      minLength: [''],
      maxLength: [''],
      x: ['', { validators: [Validators.required], updateOn: 'blur' }],
      y: ['', { validators: [Validators.required], updateOn: 'blur' }],
      w: ['', { validators: [Validators.required], updateOn: 'blur' }],
      h: ['', { validators: [Validators.required], updateOn: 'blur' }],
      rp: [''],
    });
    this.f.setValidators(this.checkValidSignatureType());
    this.minSub = this.f.get('value').valueChanges.subscribe(v => {
      if (v === true) {
        this.f.get('min').enable({ emitEvent: false });
        this.f.get('max').enable({ emitEvent: false });
      } else {
        this.f.get('min').disable({ emitEvent: false });
        this.f.get('max').disable({ emitEvent: false });
      }
    });
    this.lenSub = this.f.get('length').valueChanges.subscribe(v => {
      if (v === true) {
        this.f.get('minLength').enable({ emitEvent: false });
        this.f.get('maxLength').enable({ emitEvent: false });
      } else {
        this.f.get('minLength').disable({ emitEvent: false });
        this.f.get('maxLength').disable({ emitEvent: false });
      }
    });
    this.xSub = this.f.get('x').valueChanges.subscribe(v => {
      let _v = parseFloat(v);
      if (isNaN(_v) || _v <= 0 || _v >= this.pageSize.width - this.data.fieldBox.w) {
        _v = this.x;
        this.f.get('x').setValue(_v, { emitEvent: false });
      } else {
        this.x = _v;
      }
    });
    this.ySub = this.f.get('y').valueChanges.subscribe(v => {
      let _v = parseFloat(v);
      if (isNaN(_v) || _v <= 0 || _v >= this.pageSize.height - this.data.fieldBox.h) {
        _v = this.y;
        this.f.get('y').setValue(_v, { emitEvent: false });
      } else {
        this.y = _v;
      }
    });
    this.wSub = this.f.get('w').valueChanges.subscribe(v => {
      let _v = parseFloat(v);
      if (isNaN(_v) || _v <= 0 || _v + this.data.fieldBox.x >= this.pageSize.width || _v < DEFAULT_FIELD_SIZE[this.data.type].w) {
        _v = this.w;
        this.f.get('w').setValue(this.w, { emitEvent: false });
      } else {
        this.w = _v;
      }
    });
    this.hSub = this.f.get('h').valueChanges.subscribe(v => {
      let _v = parseFloat(v);
      if (isNumber(_v)) {
        if (isNaN(_v) || _v <= 0 || _v + this.data.fieldBox.y >= this.pageSize.height || _v < DEFAULT_FIELD_SIZE[this.data.type].h) {
          _v = this.h;
          this.f.get('h').setValue(_v, { emitEvent: false });
        } else {
          this.h = _v;
        }
      }
    });
    this.fSub = this.f.valueChanges.subscribe(v => {
      const field = this.formToField(v);
      this.fbMbusService.changeFieldValueFromProp(field);
    });
  }
  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (!isNullOrUndefined(changes['data'])) {
      this.data.fieldBox.x = Math.floor(this.data.fieldBox.x);
      this.data.fieldBox.y = Math.floor(this.data.fieldBox.y);
      this.fieldToForm(this.data);
      if (!isNullOrUndefined(this.data)) {
        this.pageSize = this.fbMbusService.getPageSize(this.data.page);
      }
    }
  }

  ngOnDestroy() {
    if (this.fieldValueChangedSub !== null) {
      this.fieldValueChangedSub.unsubscribe();
      this.fieldValueChangedSub = null;
    }
    if (this.minSub !== null) {
      this.minSub.unsubscribe();
      this.minSub = null;
    }
    if (this.lenSub !== null) {
      this.lenSub.unsubscribe();
      this.lenSub = null;
    }
    if (this.xSub !== null) {
      this.xSub.unsubscribe();
      this.xSub = null;
    }
    if (this.ySub !== null) {
      this.ySub.unsubscribe();
      this.ySub = null;
    }
    if (this.wSub !== null) {
      this.wSub.unsubscribe();
      this.wSub = null;
    }
    if (this.hSub !== null) {
      this.hSub.unsubscribe();
      this.hSub = null;
    }
  }

  changeFieldValue = (v: any) => {
    if (!isNullOrUndefined(v) && !isNullOrUndefined(this.data)) {
      if (v.id === this.data.id) {
        v.value.fieldBox.x = Math.floor(v.value.fieldBox.x);
        v.value.fieldBox.y = Math.floor(v.value.fieldBox.y);
        this.fieldToForm(v.value);
      }
    }
  };

  private fieldToForm(field: any) {
    if (!isNullOrUndefined(field)) {
      this.f.get('id').setValue(field.id, { emitEvent: false });
      this.f.get('id').disable({ emitEvent: false });
      this.f.get('name').setValue(field.name, { emitEvent: false });
      let _value = false;
      let _len = false;
      if (!isNullOrUndefined(field.validators)) {
        field.validators.forEach(v => {
          if (v.type === 'required') {
            this.f.get('required').setValue(true, { emitEvent: false });
          } else if (v.type === 'email') {
            this.f.get('email').setValue(true, { emitEvent: false });
          } else if (v.type === 'min') {
            this.f.get('min').setValue(v.expression, { emitEvent: false });
            _value = true;
          } else if (v.type === 'max') {
            this.f.get('max').setValue(v.expression, { emitEvent: false });
            _value = true;
          } else if (v.type === 'minLength') {
            this.f.get('minLength').setValue(v.expression, { emitEvent: false });
            _len = true;
          } else if (v.type === 'maxLength') {
            this.f.get('maxLength').setValue(v.expression, { emitEvent: false });
            _len = true;
          }
        });
      }
      this.f.get('value').setValue(_value, { emitEvent: false });
      if (!_value) {
        this.f.get('min').disable({ emitEvent: false });
        this.f.get('max').disable({ emitEvent: false });
      }
      this.f.get('length').setValue(_len, { emitEvent: false });
      if (!_len) {
        this.f.get('minLength').disable({ emitEvent: false });
        this.f.get('maxLength').disable({ emitEvent: false });
      }
      if (!isNullOrUndefined(field.fieldBox)) {
        this.x = field.fieldBox.x;
        this.y = field.fieldBox.y;
        this.w = field.fieldBox.w;
        this.h = field.fieldBox.h;
        this.f.get('x').setValue(field.fieldBox.x, { emitEvent: false });
        this.f.get('y').setValue(field.fieldBox.y, { emitEvent: false });
        this.f.get('w').setValue(field.fieldBox.w, { emitEvent: false });
        this.f.get('h').setValue(field.fieldBox.h, { emitEvent: false });
      }
      if (!isNullOrUndefined(field.subType)) {
        // const is = field.subType === '1' || field.subType === '3' ? true : false;
        // const ds = field.subType === '2' || field.subType === '3' ? true : false;
        // this.f.get('imageSignature').setValue(is, { emitEvent: false });
        // this.f.get('digitalSignature').setValue(ds, { emitEvent: false });

        this.f.get('imageSignature').setValue(true, { emitEvent: false });
        this.f.get('digitalSignature').setValue(false, { emitEvent: false });
      }
      this.f.get('rp').setValue(field.recipientId, { emitEvent: false });
    }
  }

  parseFieldSubType(imageSignature: boolean, digitalSignature: boolean): string {
    const i = imageSignature ? 1 : 0;
    const d = digitalSignature ? 1 : 0;
    return (i + 2 * d).toString();
  }

  formToField(v: any) {
    let field = this.fbMbusService.getField(this.data.id);
    if (!isNullOrUndefined(field)) {
      field = { ...field };
      field.name = v.name;
      field.recipientId = v.rp;
      field.fieldBox.x = parseFloat(v.x);
      field.fieldBox.y = parseFloat(v.y);
      field.fieldBox.w = parseFloat(v.w);
      field.fieldBox.h = parseFloat(v.h);
      field.subType = this.parseFieldSubType(v.imageSignature, v.digitalSignature);
      field.valid = this.f.valid;
      if (isNullOrUndefined(field.validators)) {
        field.validators = [];
        if (v.required) {
          field.validators.push({ type: ValidatorType.REQUIRED });
        }
        if (v.email) {
          field.validators.push({ type: ValidatorType.EMAIL });
        }
        if (v.value) {
          let _v = parseInt(v.min, 10);
          if (isNumber(_v)) {
            field.validators.push({ type: ValidatorType.MIN_VALUE, expression: v });
          }
          _v = parseInt(v.max, 10);
          if (isNumber(_v)) {
            field.validators.push({ type: ValidatorType.MAX_VALUE, expression: v });
          }
        }
        if (v.length) {
          let _v = parseInt(v.minLength, 10);
          if (isNumber(_v)) {
            field.validators.push({ type: ValidatorType.MIN_LENGTH, expression: v });
          }
          _v = parseInt(v.maxLength, 10);
          if (isNumber(_v)) {
            field.validators.push({ type: ValidatorType.MAX_LENGTH, expression: v });
          }
        }
      }
    }
    return field;
  }
  checkValidSignatureType(): ValidatorFn {
    return (group: FormGroup): ValidationErrors => {
      const imageSignatureControl = this.f.get('imageSignature');
      const digitalSigatureControl = this.f.get('digitalSignature');
      if (!imageSignatureControl.value && !digitalSigatureControl.value) {
        imageSignatureControl.setErrors({ notEquivalent: true });
        digitalSigatureControl.setErrors({ notEquivalent: true });
      } else {
        imageSignatureControl.setErrors(null);
        digitalSigatureControl.setErrors(null);
      }
      return null;
    };
  }
  vldSignatureSubTypeMsg() {
    const isImageSignatureSelected = this.f.get('imageSignature').value;
    const isDigitalSigatureSelected = this.f.get('digitalSignature').value;
    if (!isImageSignatureSelected && !isDigitalSigatureSelected) {
      return 'form-builder.validation.no-subtype';
    }
    return null;
  }

  vldValueMsg() {
    const _min = this.f.get('min');
    const _max = this.f.get('max');
    if (this.f.get('value').value && ((_min.touched && _min.dirty) || (_max.touched && _max.dirty))) {
      if (isNullOrUndefined(_min.value) && isNullOrUndefined(_max.value)) {
        return 'form-builder.validation.value-required';
      } else {
        let _vmin = -1;
        let _vmax = -1;
        if (!isNullOrUndefined(_min.value) && _min.value.length > 0) {
          _vmin = parseInt(_min.value, 10);
          if (isNaN(_vmin)) {
            return 'form-builder.validation.number-required';
          }
        }
        if (!isNullOrUndefined(_max.value) && _max.value.length > 0) {
          _vmax = parseInt(_max.value, 10);
          if (isNaN(_vmax)) {
            return 'form-builder.validation.number-required';
          }
        }
        if (_vmin !== -1 && _vmax !== -1 && _vmax < _vmin) {
          return 'form-builder.validation.max-le-min';
        }
      }
    }
    return null;
  }
  vldLengthMsg() {
    const _min = this.f.get('minLength');
    const _max = this.f.get('maxLength');
    if (this.f.get('value').value && ((_min.touched && _min.dirty) || (_max.touched && _max.dirty))) {
      if (isNullOrUndefined(_min.value) && isNullOrUndefined(_max.value)) {
        return 'form-builder.validation.value-required';
      } else {
        let _vmin = -1;
        let _vmax = -1;
        if (!isNullOrUndefined(_min.value) && _min.value.length > 0) {
          _vmin = parseInt(_min.value, 10);
          if (isNaN(_vmin)) {
            return 'form-builder.validation.number-required';
          }
        }
        if (!isNullOrUndefined(_max.value) && _max.value.length > 0) {
          _vmax = parseInt(_max.value, 10);
          if (isNaN(_vmax)) {
            return 'form-builder.validation.number-required';
          }
        }
        if (_vmin !== -1 && _vmax !== -1 && _vmax < _vmin) {
          return 'form-builder.validation.max-le-min';
        }
      }
    }
    return null;
  }
  getRecipients() {
    return getSigners(this.envelope, 'a');
  }

  isSignatureField() {
    return this.data.type === FieldType.SIGNATURE;
  }

  // Check whether a form field has invalid data
  public hasError(path: string): string {
    try {
      const tmp = this.f.get(path);
      if (tmp !== null) {
        if (tmp.invalid && (tmp.touched || tmp.dirty)) {
          if (tmp.errors.required) {
            return 'form-builder.validation.required';
          } else if (tmp.errors.email) {
            return 'form-builder.validation.email';
          } else if (tmp.errors.pattern) {
            return 'form-builder.validation.format';
          }
        }
      }
    } catch (error) {}
    return null;
  }

  hasImageSignature() {
    return this.f.get('imageSignature').value;
  }

  hasDigitalSignature() {
    return this.f.get('digitalSignature').value;
  }

  selectedRecipientStyle(id: any) {
    if (this.f.get('rp').value === id) {
      return {
        fontWeight: 600,
        color: 'blue',
      };
    } else {
      return {};
    }
  }
}
