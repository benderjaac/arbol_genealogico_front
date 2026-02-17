import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ResponseApiCat, ResponseApiSimple } from '../models/response-api.model';
import { Ahorro } from '../models/ahorro.model';

@Injectable({
  providedIn: 'root'
})
export class AhorroService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor() {
    this.urlApi=environment.apiUrl;
  }

  getDataAhorroCat():Observable<ResponseApiCat<Ahorro>>{
    return this._httpClient.get<ResponseApiCat<Ahorro>>(this.urlApi+'/api/ahorros/data');
  }

  getById(id: number):Observable<ResponseApiSimple<Ahorro>>{
    return this._httpClient.get<ResponseApiSimple<Ahorro>>(this.urlApi+'/api/ahorros/'+id);
  }

  createAhorro(data: Partial<Ahorro>):Observable<ResponseApiSimple<Ahorro>>{
    return this._httpClient.post<ResponseApiSimple<Ahorro>>(this.urlApi+'/api/ahorros', data);
  }

  editAhorro(id:number, data: Partial<Ahorro>):Observable<ResponseApiSimple<Ahorro>>{
    return this._httpClient.put<ResponseApiSimple<Ahorro>>(this.urlApi+'/api/ahorros/'+id, data);
  }
}
