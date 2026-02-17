import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponseApiSimple } from '../models/response-api.model';
import { BalanceUsuario } from '../models/balance-usuario.model';

@Injectable({
  providedIn: 'root'
})
export class BalanceUsuarioService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  private disponibleSubject = new BehaviorSubject<number>(0);
  disponible$ = this.disponibleSubject.asObservable();

  private ahorroSubject = new BehaviorSubject<number>(0);
  ahorro$ = this.ahorroSubject.asObservable();

  private totalSubject = new BehaviorSubject<number>(0);
  total$ = this.totalSubject.asObservable();

  constructor() {
    this.urlApi=environment.apiUrl;
  }
 
  setBalance(balance: BalanceUsuario):void{
    this.disponibleSubject.next(balance.montoDisponible);
    this.ahorroSubject.next(balance.montoAhorrado);
    this.totalSubject.next(balance.balanceTotal);
  }
  
  getDataBalanceUsuario():Observable<ResponseApiSimple<BalanceUsuario>>{
    return this._httpClient.get<ResponseApiSimple<BalanceUsuario>>(this.urlApi+'/api/balance/usuario');
  }
}
