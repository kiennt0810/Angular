import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DelegationIn } from '../doanVao.model';

@Component({
  selector: 'jhi-user-mgmt-detail',
  templateUrl: './categories-management-detail.component.html',
})
export class CategoriesManagementDetailComponent implements OnInit {
  user: DelegationIn | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ user }) => {
      this.user = user;
    });
  }
}
