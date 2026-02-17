import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AhorroService } from 'app/core/services-api/ahorro.service';
import { AutofocusDirective } from 'app/modules/utils/autofocus.directive';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-ahorro-create',
  imports: [AutofocusDirective, InputNumber, DatePickerModule, ReactiveFormsModule, InputTextModule, ButtonModule, CommonModule],
  templateUrl: './ahorro-create.component.html'
})
/**
 * Componente para crear un nuevo ahorro.
 */
export class AhorroCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  registerForm!: FormGroup;

  hoy = new Date();

  destroy$ = new Subject<void>();

  constructor(
    private _ahorroService: AhorroService,
    private _fb: FormBuilder
  ){
  }

  ngOnInit(){

    this.registerForm = this._fb.group({
      descri: ['', Validators.required],
      monto_meta: ['', Validators.required],
      fecha_inicio: [this.hoy, Validators.required],
    });

  }

  onSubmit() {
    if (this.registerForm.valid) {
      const values = this.registerForm.value;
      values.categoriaId=this.registerForm.get('categoriaId')?.value.id;

      this._ahorroService.createAhorro(this.registerForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({

          next: (res)=>{
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
