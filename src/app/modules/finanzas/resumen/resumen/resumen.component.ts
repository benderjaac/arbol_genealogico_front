import {Component} from '@angular/core';
import { BalanceUsuario } from 'app/core/models/balance-usuario.model';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { Subject, takeUntil } from 'rxjs';
import { ChartModule } from 'primeng/chart';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {GraficaTotalesMesesComponent} from '../grafica-totales-meses/grafica-totales-meses.component';
import {GraficaAcumuladosMesesComponent} from '../grafica-acumulados-meses/grafica-acumulados-meses.component';

@Component({
  selector: 'app-resumen',
  imports: [GraficaAcumuladosMesesComponent, GraficaTotalesMesesComponent, ChartModule, CurrencyPipe, DatePipe],
  standalone: true,
  templateUrl: './resumen.component.html',
})
export class ResumenComponent {

  balanceUsuario: BalanceUsuario;

  private destroy$ = new Subject<void>();

  constructor(
    private _balanceUsuarioService: BalanceUsuarioService,
  ) {
    this.balanceUsuario = undefined!;
   }

  ngOnInit(): void {
    this.cargarDataBalanceUsuario();
  }

  cargarDataBalanceUsuario(): void {
    this._balanceUsuarioService.getDataBalanceUsuario()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.balanceUsuario = response.result;
          this._balanceUsuarioService.setBalance(this.balanceUsuario);
        },
        error: (error) => {
          console.error('Error al cargar los datos del balance de usuario:', error);
        }
      });
  }
}
