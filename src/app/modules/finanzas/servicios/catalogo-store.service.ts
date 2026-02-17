import { Injectable } from '@angular/core';
import { CatalogoMap } from 'app/core/models/response-api.model';
import { CategoriaGastoService } from 'app/core/services-api/categoria-gasto.service';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogoStoreService {

  private cache: Map<string, Observable<any>> = new Map();
  
  constructor(
    private _categoriaGastoService: CategoriaGastoService,
  ) { }

  /**
   * Obtiene un catálogo, usando cache si ya fue descargado.
   * @param nombreClave Clave interna (ej. 'categorias')
   */
  getCatalogo<K extends keyof CatalogoMap>(nombreClave: K): Observable<CatalogoMap[K]> {
    if (this.cache.has(nombreClave)) {
      return this.cache.get(nombreClave)! as Observable<CatalogoMap[K]>;
    }

    let observable: Observable<CatalogoMap[K]>;

    switch (nombreClave) {
      case 'categorias':
          observable = this._categoriaGastoService.getDataCategoriasCat().pipe(
            shareReplay(1)
          ) as Observable<CatalogoMap[K]>;
        break; 
      case 'categorias_gastos':
          observable = this._categoriaGastoService.getDataCategoriasGastosCat().pipe(
            shareReplay(1)
          ) as Observable<CatalogoMap[K]>;
        break; 
      case 'categorias_ingresos':
          observable = this._categoriaGastoService.getDataCategoriasIngresosCat().pipe(
            shareReplay(1)
          ) as Observable<CatalogoMap[K]>;
        break;      
      default:
        throw new Error(`Catálogo no reconocido: ${nombreClave}`);
    }    

    this.cache.set(nombreClave, observable);
    return observable;
  }

  /**
   * Limpia un catálogo específico de la caché
   */
  clearCatalogo(nombreClave: string): void {
    this.cache.delete(nombreClave);
  }

  /**
   * Limpia todos los catálogos
   */
  clearAll(): void {
    this.cache.clear();
  }
}
