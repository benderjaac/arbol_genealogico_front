import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MovimientoService } from 'app/core/services-api/movimiento.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CatalogoStoreService } from '../../servicios/catalogo-store.service';
import { Categoria } from 'app/core/models/categoria.model';
import { Select } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { AutofocusDirective } from 'app/modules/utils/autofocus.directive';
import { Subject, takeUntil } from 'rxjs';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { CategoriaLabelComponent } from "../../shared/categoria-label/categoria-label.component";

@Component({
  selector: 'app-gasto-create',
  imports: [AutofocusDirective, InputNumber, DatePickerModule, Select, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule, CategoriaLabelComponent],
  standalone: true,
  templateUrl: './gasto-create.component.html',
})
export class GastoCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  registerForm!: FormGroup;

  catCategorias : Categoria[] = [];

  hoy = new Date();

  destroy$ = new Subject<void>();

  constructor(
    private _movimientosService: MovimientoService,
    private _fb: FormBuilder,
    private _catalogoStoreService: CatalogoStoreService,
    private _balanceUsuarioService: BalanceUsuarioService,
  ){
  }

  ngOnInit(){

    this.registerForm = this._fb.group({
      tipo: ['Gasto', Validators.required],
      monto: ['', Validators.required],
      descri: ['', Validators.required],
      categoriaId: ['',Validators.required],
      fecha: [this.hoy, Validators.required],
    });

    this.getCatalogo();
  }

  getCatalogo():void{
    this._catalogoStoreService.getCatalogo('categorias_gastos')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.catCategorias = resp.result.data;
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const values = this.registerForm.value;
      values.categoriaId=this.registerForm.get('categoriaId')?.value.id;
      values.monto=values.monto*-1;

      this._movimientosService.create(values)
        .pipe(takeUntil(this.destroy$))
        .subscribe({

          next: (res)=>{
            this._balanceUsuarioService.setBalance(res.result);
            this.msjEvent.emit({tipo:'success', mensaje:res.message});
            this.cerrarDialog.emit(true);
          },
          error: (error)=>{
            this.msjEvent.emit({tipo:'error', mensaje:error.error?.error || "Error desconocido"});
          }
        });
    }
  }
}
