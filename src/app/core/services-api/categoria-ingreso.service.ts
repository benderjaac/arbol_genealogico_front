import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { CategoriaIngreso } from '../models/categoria-ingreso.model';
import { ResponseApiCat, ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { Observable } from 'rxjs';
import { ApiQuery } from '../models/query.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaIngresoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor() { 
    this.urlApi=environment.apiUrl;
  }

  getDataCategoriasIngreso(query: ApiQuery):Observable<ResponseApiType<CategoriaIngreso>>{
    return this._httpClient.post<ResponseApiType<CategoriaIngreso>>(this.urlApi+'/api/categoria/ingreso/data', query);
  }

  getDataCategoriasIngresoCat():Observable<ResponseApiCat<CategoriaIngreso>>{
    return this._httpClient.get<ResponseApiCat<CategoriaIngreso>>(this.urlApi+'/api/categoria/ingreso/catalogo');
  }

  createCategoriaIngreso(data: Partial<CategoriaIngreso>):Observable<ResponseApiSimple<CategoriaIngreso>>{
    return this._httpClient.post<ResponseApiSimple<CategoriaIngreso>>(this.urlApi+'/api/categoria/ingreso', data);
  }
}
