
import { Component, ElementRef, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {Person} from '../../../../core/models/person.model';
import {UnionSummaryDto} from '../../../../core/models/UnionSummary.model';
import {PersonService} from '../../../../core/services-api/person.service';
import {Subject, takeUntil} from 'rxjs';
import {UnionService} from '../../../../core/services-api/union.service';
import {Table, TableModule} from 'primeng/table';
import {Select} from 'primeng/select';
import {DatePicker} from 'primeng/datepicker';

@Component({
  selector: 'app-persons-create',
  imports: [AutoFocusModule, FormsModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, Select, DatePicker],
  templateUrl: './persons-create.component.html',
})
export class PersonsCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  destroy$ = new Subject<void>();

  loading = false;

  form!: FormGroup;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private _personService : PersonService,
    private fb: FormBuilder,
  ){
  }

  ngOnInit(){
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: [''],
      fechaNacimiento: [''],
      genero: ['', Validators.required],
      lugarNacimiento: [''],
      notas: [''],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result as string;
    reader.readAsDataURL(file);
  }

  crearPersona() {
    this.loading = true;

    const formData = new FormData();

    formData.append(
      'person',
      new Blob([JSON.stringify(this.form.value)], { type: 'application/json' })
    );

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }


    this._personService.create(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
    });
  }
}
