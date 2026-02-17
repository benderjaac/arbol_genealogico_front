import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { User } from '../models/user.model';
import { ApiQuery } from '../models/query.model';
import {Person} from '../models/person.model';

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
}
