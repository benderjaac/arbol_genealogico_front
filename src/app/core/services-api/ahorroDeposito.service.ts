import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiQuery } from '../models/query.model';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import {AhorroDeposito} from '../models/ahorro-deposito.model';
import { BalanceUsuario } from '../models/balance-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AhorroDepositoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getData(idahorro:number, query: ApiQuery):Observable<ResponseApiType<AhorroDeposito>>{
    return this._httpClient.post<ResponseApiType<AhorroDeposito>>(this.urlApi+'/api/ahorros/depositos/data/'+idahorro, query);
  }

  create(idAhorro:number, data:Partial<AhorroDeposito>):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.post<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/ahorros/depositos/'+idAhorro, data);
  }

  update(idAhorro:number, data:Partial<AhorroDeposito>, idDeposito:number):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.put<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/ahorros/depositos/'+idAhorro+'/'+idDeposito, data);
  }

  delete(idAhorro:number, idDeposito:number):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.delete<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/ahorros/depositos/'+idAhorro+'/'+idDeposito);
  }
}
