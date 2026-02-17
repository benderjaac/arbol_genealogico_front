import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, Signal } from '@angular/core';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-disponible',
  imports: [CommonModule],
  template: `
  <div class="flex justify-between gap-4 pt-3">
    <div class="ml-2">
      <p 
      class="font-bold"
      [ngClass]="{'text-red-500': disponible() < 0, 'text-green-500': disponible() >= 0}">{{ disponible() | currency }}</p>
      <p class="text-muted-color text-xs">Disponible </p>
    </div>
    <div class="ml-2">
      <p 
      class="font-bold"
      [ngClass]="{'text-red-500': ahorro() < 0, 'text-green-500': ahorro() >= 0}">{{ ahorro() | currency }}</p>
      <p class="text-muted-color text-xs">Ahorro </p>
    </div>
    <div class="ml-2">
      <p 
      class="font-bold"
      [ngClass]="{'text-red-500': total() < 0, 'text-green-500': total() >= 0}">{{ total() | currency }}</p>
      <p class="text-muted-color text-xs">Total </p>
    </div>
  </div>
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisponibleComponent {

  disponible = signal<number>(0);
  ahorro = signal<number>(0);
  total = signal<number>(0);

  destroy$ = new Subject<void>();

  constructor(
    private _balanceUsuarioService: BalanceUsuarioService,
  ) {
  }

  ngOnInit(): void {

    this._balanceUsuarioService.getDataBalanceUsuario().subscribe({
      next: (res) => {
        this._balanceUsuarioService.setBalance(res.result);
        this.disponible.set(res.result.montoDisponible);
        this.ahorro.set(res.result.montoAhorrado);
        this.total.set(res.result.balanceTotal);
      },
      error: (error) => {
        console.error(error);
      }
    });

    this._balanceUsuarioService.disponible$.subscribe(valor => {
      this.disponible.set(valor);
    });

    this._balanceUsuarioService.ahorro$.subscribe(valor => {
      this.ahorro.set(valor);
    });

    this._balanceUsuarioService.total$.subscribe(valor => {
      this.total.set(valor);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
