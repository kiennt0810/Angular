import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from './register.service';
import { AlertService } from 'app/core/util/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
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

  constructor(private registerService: RegisterService, private toast: AlertService, private router: Router) {}

  ngOnInit(): void {}

  numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
  }

  save(): void {
    let data: any = {
      ...this.registerForm.value,
      cusType: 'O',
      price: 0,
      registerOrderType: 'pro',
      saleProductId: '10',
    };
    if (this.registerForm.valid) {
      this.registerService.register(data).subscribe({
        next: res => {
          this.toast.addAlert({ message: 'Đăng ký thành công', type: 'success', toast: true });
          this.router.navigate(['/login']);
        },
        error: error => {
          this.toast.addAlert({ message: 'Đăng ký không thành công', type: 'success', toast: true });
          // this.toast.addAlert({ message: `${error}`, type: 'danger', toast: true })
        },
      });
    }
  }
}
