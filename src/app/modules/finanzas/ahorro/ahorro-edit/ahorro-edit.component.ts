import {Component, EventEmitter, Input, Output} from '@angular/core';
import { Ahorro } from 'app/core/models/ahorro.model';
import {AhorroService} from '../../../../core/services-api/ahorro.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {AutofocusDirective} from '../../../utils/autofocus.directive';
import {ButtonDirective, ButtonModule} from 'primeng/button';
import {DatePicker, DatePickerModule} from 'primeng/datepicker';
import {InputNumber} from 'primeng/inputnumber';
import {InputText, InputTextModule} from 'primeng/inputtext';
import {CommonModule, NgIf} from '@angular/common';

@Component({
  selector: 'app-ahorro-edit',
  imports: [DatePickerModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    AutofocusDirective,
    ButtonDirective,
    DatePicker,
    FormsModule,
    InputNumber,
    InputText,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './ahorro-edit.component.html',
})
export class AhorroEditComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @Input() ahorroEdting: Ahorro | null = null;

  editingForm!: FormGroup;

  destroy$ = new Subject<void>();

  constructor(
    private _ahorroService: AhorroService,
    private _fb: FormBuilder
  ){
  }

  ngOnInit(){
    this.editingForm = this._fb.group({
      descri: [this.ahorroEdting?.descri, Validators.required],
      monto_meta: [this.ahorroEdting?.monto_meta, Validators.required],
      fecha_inicio: [this.ahorroEdting?.fecha_inicio, Validators.required],
    });

  }

  onSubmit() {
    if (this.editingForm.valid) {
      const values = this.editingForm.value;
      values.categoriaId=this.editingForm.get('categoriaId')?.value.id;

      this._ahorroService.editAhorro(this.ahorroEdting!.id, this.editingForm.value)
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
