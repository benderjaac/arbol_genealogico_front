import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { User } from '../models/user.model';
import { ApiQuery } from '../models/query.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;
    
  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getDataUsers(query: ApiQuery):Observable<ResponseApiType<User>>{
    return this._httpClient.post<ResponseApiType<User>>(this.urlApi+'/api/users/data', query);
  }

  createUser(data:any):Observable<ResponseApiSimple<User>>{
    return this._httpClient.post<ResponseApiSimple<User>>(this.urlApi+'/api/users', data);
  }
}
