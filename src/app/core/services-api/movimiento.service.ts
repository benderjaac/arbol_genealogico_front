import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Movimiento } from '../models/movimiento.model';
import { Observable } from 'rxjs';
import { ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { ApiQuery } from '../models/query.model';
import { BalanceUsuario } from '../models/balance-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor(
  ) {
    this.urlApi=environment.apiUrl;
  }

  getData(query: ApiQuery):Observable<ResponseApiType<Movimiento>>{
    return this._httpClient.post<ResponseApiType<Movimiento>>(this.urlApi+'/api/movimientos/data', query);
  }

  create(data:Partial<Movimiento>):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.post<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/movimientos', data);
  }

  update(id:number, data:Partial<Movimiento>):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.put<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/movimientos/'+id, data);
  }

  delete(id:number):Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.delete<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/movimientos/'+id);
  }
}
