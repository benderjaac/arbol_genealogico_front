
import { Component, ElementRef, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import {Person} from '../../../../core/models/person.model';
import {UnionSummaryDto} from '../../../../core/models/UnionSummary.model';
import {PersonService} from '../../../../core/services-api/person.service';
import {Subject, takeUntil} from 'rxjs';
import {UnionService} from '../../../../core/services-api/union.service';
import {Table, TableModule} from 'primeng/table';

@Component({
  selector: 'app-parejas-modal',
  imports: [AutoFocusModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule],
  templateUrl: './parejas-modal.component.html',
})
export class ParejasModalComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @Input()
  persona!: Person;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  destroy$ = new Subject<void>();

  parejas: UnionSummaryDto[]=[];
  creatingMode = false;
  selectedSpouse: Person | null = null;
  loading = false;

  constructor(
    private _personService : PersonService,
    private _unionService: UnionService,
  ){
  }

  ngOnInit(){
    this.loadParejas();
  }

  loadParejas(){
    this.loading=true;
    this._personService.getParejas(this.persona.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res)=>{
          console.log(res);
          this.parejas=res.result;
          console.log(this.parejas);
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
      error: () => {
        this.loading = false;
      }
    });
  }

  cancelCreate() {

  }

  eliminarUnion(pareja: any) {

  }

  verHijos(pareja: any) {

  }
}
