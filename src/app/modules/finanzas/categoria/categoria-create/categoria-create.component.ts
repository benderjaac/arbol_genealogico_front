import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriaGastoService } from 'app/core/services-api/categoria-gasto.service';
import { AutofocusDirective } from 'app/modules/utils/autofocus.directive';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';
import { Select } from 'primeng/select';
import { CatalogoStoreService } from '../../servicios/catalogo-store.service';

@Component({
  selector: 'app-categoria-create',
  imports: [Select, AutofocusDirective, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './categoria-create.component.html',
})
export class CategoriaCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  registerForm!: FormGroup;

  destroy$ = new Subject<void>();

  constructor(
    private _categoriaGastoService: CategoriaGastoService,
    private _fb: FormBuilder,
    private _catalogoStoreService:CatalogoStoreService
  ){    
  }

  ngOnInit(){
    
    this.registerForm = this._fb.group({
      nombre: ['', Validators.required],
      descri: [''],
      tipo: ['', Validators.required],
      color: [''],
      icon: [''],
    });
    
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const values = this.registerForm.value;
      values.categoriaId=this.registerForm.get('categoriaId')?.value.id;

      this._categoriaGastoService.createCategoria(this.registerForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          
          next: (res)=>{
            this._catalogoStoreService.clearCatalogo('categorias');
            if(this.registerForm.get('tipo')?.value=='Ingreso'){
              this._catalogoStoreService.clearCatalogo('categorias_ingresos');
            }else{
              this._catalogoStoreService.clearCatalogo('categorias_gastos');
            }
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
