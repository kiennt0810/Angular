import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Passport } from '../loaihochieu.model';


@Component({
  selector: 'jhi-passport-mgmt-detail',
  templateUrl: './passport-detail.component.html',
})
export class PassportDetailComponent implements OnInit {
    passport: Passport | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ Passport }) => {
      this.passport = Passport;
    });
  }
}
