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
export class PersonService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getDataPersons(query: ApiQuery):Observable<ResponseApiType<Person>>{
    return this._httpClient.post<ResponseApiType<Person>>(this.urlApi+'/api/persons/data', query);
  }

  createPerson(data:any):Observable<ResponseApiSimple<Person>>{
    return this._httpClient.post<ResponseApiSimple<Person>>(this.urlApi+'/api/persons', data);
  }

  update(id:number, data:Partial<Person>):Observable<ResponseApiSimple<Person>>{
    return this._httpClient.put<ResponseApiSimple<Person>>(this.urlApi+'/api/persons/'+id, data);
  }

  delete(id:number):Observable<ResponseApiSimple<null>>{
    return this._httpClient.delete<ResponseApiSimple<null>>(this.urlApi+'/api/persons/'+id);
  }

  getParejas(id:number) :Observable<ResponseApiSimple<UnionSummaryDto[]>>{
    return this._httpClient.get<ResponseApiSimple<UnionSummaryDto[]>>(this.urlApi+'/api/unions/person/'+id);
  }
}
