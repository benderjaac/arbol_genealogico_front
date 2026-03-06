
import { Component, ElementRef, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {Person} from '../../../../core/models/person.model';
import {UnionSummaryDto} from '../../../../core/models/UnionSummary.model';
import {PersonService} from '../../../../core/services-api/person.service';
import {Subject, takeUntil} from 'rxjs';
import {UnionService} from '../../../../core/services-api/union.service';
import {Table, TableModule} from 'primeng/table';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {Tooltip} from 'primeng/tooltip';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-pareja-modal',
  imports: [AutoFocusModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, AutoComplete, FormsModule, Tooltip, JsonPipe],
  templateUrl: './pareja-modal.component.html',
})
export class ParejaModalComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @Input()
  persona!: Person;

  @Input()
  accion!: string;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  destroy$ = new Subject<void>();

  parejas: UnionSummaryDto[]=[];
  creatingMode = false;
  selectedSpouse: Person | null = null;

  filteredPersons: Person[] = [];
  parejaIds: number[] = [];
  loading = false;

  constructor(
    private _personService : PersonService,
    private _unionService: UnionService,
  ){
  }

  ngOnInit(){
    this.loadParejas();
    if(this.accion==='add'){
        console.log("Voy agregar nueva pareja",this.persona);
        this.creatingMode = true
    }
  }

  loadParejas(){
    this.loading=true;
    this._personService.getParejas(this.persona.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res)=>{
          this.parejas=res.result;
          this.parejaIds = this.parejas.map(p => p.spouse.id);
          this.loading=false;
        },
        error: (error)=>{
          this.msjEvent.emit({tipo:'error', mensaje:error.error?.error || "Error desconocido"});
          this.loading=false;
        }
      });
  }

  crearUnion() {

    if (!this.selectedSpouse) return;

    this.loading = true;

    this._unionService.create({
      person1Id: this.persona.id,
      person2Id: this.selectedSpouse.id
    }).subscribe({
      next: () => {

        this.loadParejas(); // recargar lista

        this.selectedSpouse = null;
        this.creatingMode = false;

        this.loading = false;
      },
      error: (error) => {
        this.msjEvent.emit({tipo:'error', mensaje:error.error?.error || "Error desconocido"});
        this.loading = false;
      }
    });
  }

  cancelCreate() {
    this.selectedSpouse = null;
    this.creatingMode = false;
  }

  eliminarUnion(pareja: any) {

  }

  verHijos(pareja: any) {

  }

  buscarPersonas(event: AutoCompleteCompleteEvent) {
    const query = event.query?.trim();

    if (!query || query.length < 2) {
      this.filteredPersons = [];
      return;
    }

    this._personService.search(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.filteredPersons = res.result.data
            .filter(p =>
              p.id !== this.persona.id && !this.parejaIds.includes(p.id))

        },
        error: () => {
          this.filteredPersons = [];
        }
      });
  }
}
