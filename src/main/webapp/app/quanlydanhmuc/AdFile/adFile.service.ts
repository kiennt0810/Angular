import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { API_URL } from 'app/app.constants';
import { AdFile } from './adFile.model';

@Injectable({ providedIn: 'root' })
export class AdFileService {

  private resourceUrl = API_URL + "/api/AdFile";

  readonly userid = "Client-ID ef2c5ad206c6ed1";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(formData: FormData) {
    return this.http.post(this.resourceUrl, formData, {  observe: 'response' });
  }

  update(obj: AdFile): Observable<AdFile> {
    return this.http.put<AdFile>(this.resourceUrl, obj);
  }

  find(id: number): Observable<AdFile> {
    return this.http.get<AdFile>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<AdFile[]>> {
    const options = createRequestOption(req);
    return this.http.get<AdFile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getLstBrand(): Observable<HttpResponse<AdFile[]>> {
    return this.http.get<AdFile[]>(this.resourceUrl, { observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  getCurrentData(brandId: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${brandId}`);
  }

  async upload2imgur(image:any){
    return new Promise((resolve,reject) => {
      let img = image.substr(image.indexOf(',') + 1); 
      let fd = new FormData();
      fd.append('image',img);      
      let xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api.imgur.com/3/image', true);    
      xhr.onload = resolve;
      //xhr.onerror = reject;
      xhr.setRequestHeader("Authorization", this.userid);
      xhr.send(fd);
    })
    
  }

}
