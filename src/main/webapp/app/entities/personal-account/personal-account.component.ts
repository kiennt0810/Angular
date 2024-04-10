import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'app/login/login.service';
import { ModalChangePasswordComponent } from './modal/modal-change-password/modal-change-password.component';
import { faL } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'jhi-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.scss'],
})
export class PersonalAccountComponent implements OnInit {
  active: any = 'AccountSettings';

  isHideDigitalCertificate: boolean = true;

  personalAccountForm = new FormGroup({
    address: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    orgAcronym: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    orgName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    taxCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cusType: new FormControl('O'),
    price: new FormControl(0),
    registerOrderType: new FormControl('pro'),
    saleProductId: new FormControl('10'),
  });

  constructor(private loginService: LoginService, private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {}

  opentModalChangePassword() {
    const dialogRef = this.modalService.open(ModalChangePasswordComponent, {
      size: 'lg',
      centered: true,
    });
    dialogRef.result.then(
      result => {
        console.log('Closed');
      },
      reason => {
        console.log('Dismissed');
      }
    );
  }

  visitViewDigitalCertificate() {
    this.isHideDigitalCertificate = false;
    console.log(this.isHideDigitalCertificate);
  }

  logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }
}
