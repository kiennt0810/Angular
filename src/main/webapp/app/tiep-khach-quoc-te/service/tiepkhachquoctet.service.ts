import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { Pagination } from 'app/core/request/request.model';
import { ITKQTThongTinVM } from '../TKQTThongTinVM.model';
import { API_URL } from 'app/app.constants';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class TiepkhachquocteService {

  private resourceUrl = API_URL + '/api/TKQTThongTin';

  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(payload: FormData) {
    return this.http.post(this.resourceUrl, payload, { observe: 'response' });  
  }

  update(payload: FormData) {
    return this.http.put(this.resourceUrl, payload, { observe: 'response' });  
  }

  find(login: string): Observable<ITKQTThongTinVM> {
    return this.http.get<ITKQTThongTinVM>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<ITKQTThongTinVM[]>> {
    const options = createRequestOption(req);
    return this.http.get<ITKQTThongTinVM[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${id}`);
  }

  // authorities(): Observable<string[]> {
  //   return this.http.get<string[]>(this.applicationConfigService.getEndpointFor('api/authorities'));
  // }

  getCurrentData(id: number): Observable<any> {
    return this.http.get(`${this.resourceUrl}/${id}`);
  }
  
  downloadFile(id: number): Observable<any> {
		return this.http.get(`${this.resourceUrl}/download/${id}`, {responseType: 'blob'});
  }


}
