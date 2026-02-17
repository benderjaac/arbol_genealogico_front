import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PermisoDTO } from 'app/core/models/permisoDTO.model';
import { ResponseAuth, ResponseApiSimple } from 'app/core/models/response-api.model';
import { User } from 'app/core/models/user.model';
import { AuthApiService } from 'app/core/services-api/auth-api.service';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  public _authenticated = signal<boolean>(false);
  public _user = signal<User | null>(null); 
  public _roles = new Set<string>();   
  
  constructor(
    private _authApiService: AuthApiService,
  ) { }

  signIn(credentials:{username:string, password:string}):Observable<ResponseAuth>{
    if ( this._authenticated() ){
        return throwError('El usuario ya esta logueado');
    }
    localStorage.removeItem('auth_token');
    return this._authApiService.signIn(credentials).pipe(
      tap((response: ResponseAuth) => {        
        localStorage.setItem('auth_token', response.token);
        this._user.set(response.user);        
        this._authenticated.set(true);
        this.extractRoles(response.user.perfil!.menu);        
      })
    );
  }

  signOut(): void{
    localStorage.removeItem('auth_token');
    this._user.set(null);
    this._roles.clear();
    this._authenticated.set(false);    
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  checkToken(): Observable<boolean>{
    return this._authApiService.checkMe().pipe(
      tap((response: ResponseApiSimple<User>) => {
        this._user.set(response.result);
        this._authenticated.set(true);        
        this.extractRoles(response.result.perfil!.menu);
      }),
      map(() => true),
      catchError(() => {
        return of(false);
      })
    );  
  }

  register(data:{username:string, password:string, email:string}):Observable<ResponseAuth>{
    localStorage.removeItem('auth_token');
    return this._authApiService.register(data).pipe(
      tap((response: ResponseAuth) => {        
        localStorage.setItem('auth_token', response.token);
        this._user.set(response.user);
        this._authenticated.set(true);
        this.extractRoles(response.user.perfil!.menu);        
      })
    );
  } 

  extractRoles(permisos: PermisoDTO[]): void {
    this._roles.clear();
    const traverse = (permisos: PermisoDTO[]) => {
      for (const p of permisos) {
        if (p.rol) this._roles.add("/"+p.link);
        if (p.hijos) traverse(p.hijos);
      }
    };
    traverse(permisos); 
  }

  permiso(url:string):boolean{
    return this._roles.has(url);
  }
  
}
