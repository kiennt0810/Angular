import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  $commentSelected: Subject<any> = new Subject<any>();
  $commentUnselect: Subject<any> = new Subject<any>();
  $commentUpdate: Subject<any> = new Subject<any>();

  resourcePUrl = '';
  resourceV2Url = '';

  constructor(private http: HttpClient) {}

  setSelectedCommentId(commentId) {
    this.$commentSelected.next(commentId);
  }

  getSelectedCommentId() {
    return this.$commentSelected.asObservable();
  }

  setUnselectComment() {
    this.$commentUnselect.next(true);
  }

  getUnselectComment() {
    return this.$commentUnselect.asObservable();
  }

  updateCommentValue(comment: any) {
    this.$commentUpdate.next(comment);
  }

  updateCommentValueChange() {
    return this.$commentUpdate.asObservable();
  }

  // getCommentInternal(id: string): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(`${this.resourceV2Url}/getAllCommentEnvelopeInternal?id=${id}`, { observe: 'response' });
  // }
  //
  // getCommentExternal(id: string): Observable<HttpResponse<any>> {
  //   return this.http.get<any>(`${this.resourcePUrl}/${id}/getAllCommentEnvelopePublicExternal?id=${id}`, { observe: 'response' });
  // }
  //
  // saveCommentInternal(dto: any, id): Observable<HttpResponse<any>> {
  //   return this.http.post<any>(`${this.resourceV2Url}/saveCommentEnvelopeInternal?id=${id}`, dto, { observe: 'response' });
  // }
  //
  // saveCommentExternal(dto: any, id: any): Observable<HttpResponse<any>> {
  //   return this.http.post<any>(`${this.resourcePUrl}/${id}/saveCommentEnvelopePublicExternal?id=${id}`, dto, { observe: 'response' });
  // }
  //
  // removeCommentExternal(envelopeId: string, id: any): Observable<any> {
  //   return this.http.delete(`${this.resourcePUrl}/${envelopeId}/deleteCommentExternal`, {
  //     params: { envelopeId: envelopeId, id: id },
  //     responseType: 'text'
  //   });
  // }
  //
  // removeCommentInternal(envelopeId: string, id: any): Observable<any> {
  //   return this.http.delete(`${this.resourceV2Url}/deleteCommentInternal`, {
  //     params: { envelopeId: envelopeId, id: id },
  //     responseType: 'text'
  //   });
  // }
  //
  // getCommentUpdateHistoryExternal(commentId: string, envelopeId: any): Observable<any> {
  //   return this.http.get<any>(`${this.resourcePUrl}/${envelopeId}/getCommentByCommentIdExternal`, {
  //     params: { commentId: commentId, id: envelopeId },
  //     observe: 'response'
  //   });
  // }
  //
  // getCommentUpdateHistoryInternal(commentId: string, envelopeId: any): Observable<any> {
  //   return this.http.get<any>(`${this.resourceV2Url}/getCommentEnvelopeByCommentIdInternal`, {
  //     params: { commentId: commentId, id: envelopeId },
  //     observe: 'response'
  //   });
  // }
}
