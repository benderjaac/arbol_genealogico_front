import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuComponent } from '../menu/menu.component';
import { DisponibleComponent } from 'app/modules/finanzas/disponible/disponible.component';
import { Ripple } from "primeng/ripple";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [DisponibleComponent, RouterOutlet, CommonModule, ButtonModule, DrawerModule, AvatarModule, PanelMenuModule, MenuComponent, Ripple],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {

  showSidebar = signal(false);
  isMobile = signal(window.innerWidth <= 768);

  isDarkMode = false;

  constructor(
    public _authService: AuthService,
    private _router: Router
  ) {
    if(!this.isMobile()){
        this.showSidebar.set(true);
      } 
    window.addEventListener('resize', () => {
      this.showSidebar.set(false);
      this.isMobile.set(window.innerWidth <= 768); 
      if(!this.isMobile()){
        this.showSidebar.set(true);
      }     
    });
  }

  ngOnInit():void{  
    const userPref = localStorage.getItem('theme');
    if (userPref === 'dark') {
      this.isDarkMode=true;
      document.documentElement.classList.add('p-dark');
    }
  }
  
  toggleSidebar() {
    this.showSidebar.set(!this.showSidebar());
  }

  singOut():void{
    this._router.navigate(['/sign-out']);  
  }  

  toggleTheme(): void {
    if (document.documentElement.classList.contains('p-dark')) {
      document.documentElement.classList.remove('p-dark');
      localStorage.setItem('theme', 'light');
      this.isDarkMode=false;
    } else {
      document.documentElement.classList.add('p-dark');
      localStorage.setItem('theme', 'dark');
      this.isDarkMode=true;
    }
  }  
}
