import { Component, OnInit } from '@angular/core';
import { AlertServiceCheck } from './alertNew.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alertNew.component.html',
  styleUrls: ['./alertNew.component.scss']
})
export class AlertComponentCheck implements OnInit {

  constructor(public alert: AlertServiceCheck) { }

  ngOnInit() {
  }

}