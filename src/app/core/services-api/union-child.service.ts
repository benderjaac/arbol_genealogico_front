import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { User } from '../models/user.model';
import { ApiQuery } from '../models/query.model';
import {Person} from '../models/person.model';
import {UnionSummaryDto} from '../models/UnionSummary.model';

@Injectable({
  providedIn: 'root'
})
export class UnionChildService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  create(param: { childId: number; unionId: number }) {
    return this._httpClient.post<ResponseApiSimple<UnionSummaryDto>>(this.urlApi+'/api/child', param);
  }

  delete(unionId:number, personId:number):Observable<ResponseApiSimple<null>>{
    return this._httpClient.delete<ResponseApiSimple<null>>(this.urlApi+'/api/child/'+unionId+'/'+personId);
  }
}
