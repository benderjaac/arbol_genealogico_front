
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService} from 'app/auth/auth.service';
import { PermisoDTO } from 'app/core/models/permisoDTO.model';
import { Ripple } from 'primeng/ripple';
import { StyleClass } from 'primeng/styleclass';

@Component({
  selector: 'app-menu',
  imports: [Ripple, StyleClass, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  perfilMenu:PermisoDTO[]=[];

  constructor(
    public _authService: AuthService
  ) {}

  ngOnInit():void{
    this.perfilMenu = this._authService._user()?.perfil!.menu ?? [];    
  }
}
