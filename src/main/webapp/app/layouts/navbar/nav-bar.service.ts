import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavBarService {

  
  private currentPath = new BehaviorSubject<string>('');
  private subPath = new BehaviorSubject<string>('');
  private subName = new BehaviorSubject<string>('');

  getCurrentPath = this.currentPath.asObservable();
  setSubPath = this.subPath.asObservable();
  setSubName = this.subName.asObservable();

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  getPath(currentPath: string) {
    this.currentPath.next(currentPath);
  }

  getSubPath(subPath: string, subName: string) {
    this.subPath.next(subPath);
    this.subName.next(subName);
    //console.log(this.subPath, this.subName);
  }
}
