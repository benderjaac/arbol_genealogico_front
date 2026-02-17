import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseAuth, ResponseApiSimple } from 'app/core/models/response-api.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  
  private _httpClient = inject(HttpClient);
  private urlApi: string;
  
  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  signIn(credentials:{username:string, password:string}):Observable<ResponseAuth>{
    return this._httpClient.post<ResponseAuth>(this.urlApi+'/auth/login', credentials);
  }

  checkMe():Observable<ResponseApiSimple<User>>{
    return this._httpClient.get<ResponseApiSimple<User>>(this.urlApi+'/api/users/me');
  }

  register(data:{username:string, password:string, email:string}):Observable<ResponseAuth>{
    return this._httpClient.post<ResponseAuth>(this.urlApi+'/auth/register', data);
  }
}
