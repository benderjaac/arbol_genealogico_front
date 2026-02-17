import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutofocusDirective } from 'app/modules/utils/autofocus.directive';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { CatalogoStoreService } from '../../servicios/catalogo-store.service';
import { Subject, takeUntil } from 'rxjs';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { MovimientoService } from 'app/core/services-api/movimiento.service';
import { Categoria } from 'app/core/models/categoria.model';
import { CategoriaLabelComponent } from "../../shared/categoria-label/categoria-label.component";

@Component({
  selector: 'app-ingreso-create',
  imports: [AutofocusDirective, InputNumber, DatePickerModule, Select, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule, CategoriaLabelComponent],
  standalone: true,
  templateUrl: './ingreso-create.component.html',
})
export class IngresoCreateComponent {
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
    private _balanceUsuarioService: BalanceUsuarioService
  ){    
  }

  ngOnInit(){
    
    this.registerForm = this._fb.group({
      tipo: ['Ingreso', Validators.required],
      monto: ['', Validators.required],
      descri: ['', Validators.required],
      categoriaId: ['',Validators.required],
      fecha: [this.hoy, Validators.required],
    });

    this._catalogoStoreService.getCatalogo('categorias_ingresos')
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
