import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { Product } from './product.model';
import { API_URL } from 'app/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private resourceUrl = API_URL + '/api/Product';

  readonly userid = "Client-ID ef2c5ad206c6ed1";

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(formData: FormData) {
    return this.http.post(this.resourceUrl, formData, { observe: 'response' });
  }

  update(formData: FormData) {
    return this.http.put(this.resourceUrl, formData, { observe: 'response' });
  }

  find(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.resourceUrl}/${id}`);
  }

  query(req?: Pagination): Observable<HttpResponse<Product[]>> {
    const options = createRequestOption(req);
    return this.http.get<Product[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  getCurrentData(id: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`);
  }
  
  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
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
