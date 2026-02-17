import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { ApiQuery } from '../models/query.model';
import { Observable } from 'rxjs';
import { ResponseApiCat, ResponseApiSimple, ResponseApiType } from '../models/response-api.model';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaGastoService {

  private _httpClient = inject(HttpClient);
  private urlApi: string;

  constructor() { 
    this.urlApi=environment.apiUrl;
  }

  getDataCategorias(query: ApiQuery):Observable<ResponseApiType<Categoria>>{
    return this._httpClient.post<ResponseApiType<Categoria>>(this.urlApi+'/api/categoria/data', query);
  }

  getDataCategoriasCat():Observable<ResponseApiCat<Categoria>>{
    return this._httpClient.get<ResponseApiCat<Categoria>>(this.urlApi+'/api/categoria/catalogo');
  }

  getDataCategoriasGastosCat():Observable<ResponseApiCat<Categoria>>{
    return this._httpClient.get<ResponseApiCat<Categoria>>(this.urlApi+'/api/categoria/catalogo/gastos');
  }

  getDataCategoriasIngresosCat():Observable<ResponseApiCat<Categoria>>{
    return this._httpClient.get<ResponseApiCat<Categoria>>(this.urlApi+'/api/categoria/catalogo/ingresos');
  }

  createCategoria(data: Partial<Categoria>):Observable<ResponseApiSimple<Categoria>>{
    return this._httpClient.post<ResponseApiSimple<Categoria>>(this.urlApi+'/api/categoria', data);
  }


}
