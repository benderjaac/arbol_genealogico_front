import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categoria } from 'app/core/models/categoria.model';
import { Movimiento } from 'app/core/models/movimiento.model';

@Component({
  selector: 'app-categoria-label',
  imports: [CommonModule],
  template: `
  <div
    class="rounded-md px-2 text-shadow-md"
    [ngClass]="_categoria()?.color">
    <i *ngIf="_categoria()?.icon!=null" [class]="_categoria()?.icon"></i>
    {{ _categoria()?.nombre }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriaLabelComponent {
  public _categoria = signal<Categoria | undefined>(undefined);

  @Input()
  set categoria(value: Categoria) {
    this._categoria.set(value);
  }

  @Input()
  set movimiento(value: Movimiento) {
    const cat: Categoria = {
      id:0,
      color:value.categoriaColor,
      descri:"",
      tipo:"",
      icon:value.categoriaIcon,
      nombre:value.categoriaNombre,
      visible:true,
    };
    this._categoria.set(cat);
  }
 }
