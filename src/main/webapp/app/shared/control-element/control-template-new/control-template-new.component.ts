import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { clearSubscriptions } from '../../util/func-util';

@Component({
  selector: 'jhi-control-template-new',
  templateUrl: './control-template-new.component.html',
  styleUrls: ['./control-template-new.component.scss'],
})
export class ControlTemplateNewComponent implements OnInit {
  signType: any;
  width: any;
  height: any;
  templateForm: FormGroup = this.formBuilder.group({
    templateName: [null, { validators: [Validators.required] }],
    signType: [''],
    width: [0],
    height: [0],
  });
  isSaving = false;
  createTemplateSub: Subscription;

  constructor(
    private ngbActiveModal: NgbActiveModal,
    private formBuilder: FormBuilder // private controlTemplateConfigService: ControlTemplateConfigService
  ) {}

  ngOnInit() {
    this.setValueToForm();
  }

  ngOnDestroy(): void {
    clearSubscriptions(this.createTemplateSub);
  }

  setValueToForm() {
    this.templateForm.get('signType').setValue(this.signType);
    this.templateForm.get('width').setValue(this.width);
    this.templateForm.get('height').setValue(this.height);
  }

  save() {
    if (this.templateForm.valid) {
      this.isSaving = false;
      const templateDto = this.createDto();
      // this.createTemplateSub = this.controlTemplateConfigService.createControlTemplate(templateDto).subscribe(
      //   res => {
      //     this.ngbActiveModal.close();
      //     this.jhiAlertService.success('control-template-config.alert.success-create-new');
      //     this.jhiEventManager.broadcast({
      //       name: 'updateControlTemplateList',
      //       content: ''
      //     });
      //   },
      //   error => {
      //     this.jhiAlertService.error('control-template-config.alert.error-create-new');
      //   }
      // );
    } else {
      this.isSaving = true;
    }
  }

  createDto() {
    return {
      active: true,
      controlSetting: {
        h: this.templateForm.get('height').value,
        w: this.templateForm.get('width').value,
      },
      controlType: this.templateForm.get('signType').value,
      createdBy: null,
      createdDate: null,
      custId: null,
      id: null,
      lastModifiedBy: null,
      lastModifiedDate: null,
      name: this.templateForm.get('templateName').value,
      orgIn: null,
      owner: null,
    };
  }

  close() {
    this.ngbActiveModal.close();
  }
}
