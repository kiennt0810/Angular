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

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(pro: Product): Observable<Product> {
    return this.http.post<Product>(this.resourceUrl, pro);
  }

  update(pro: Product): Observable<Product> {
    return this.http.put<Product>(this.resourceUrl, pro);
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


}
