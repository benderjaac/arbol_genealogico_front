
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
import {TableModule} from 'primeng/table';
import {Tag} from 'primeng/tag';
import {HijosTableComponent} from '../hijos-table/hijos-table.component';
import {Dialog} from 'primeng/dialog';
import {AddSpouseModalComponent} from '../add-spouse-modal/add-spouse-modal.component';
import {ButtonPersonOptionsComponent, EventAccion} from '../button-person-options/button-person-options.component';
import {AddChildrenModalComponent} from '../add-children-modal/add-children-modal.component';

@Component({
  selector: 'app-descendencia-modal',
  imports: [AutoFocusModule, ReactiveFormsModule, InputTextModule, ButtonModule, TableModule, FormsModule, Tag, HijosTableComponent, Dialog, AddSpouseModalComponent, ButtonPersonOptionsComponent, AddChildrenModalComponent],
  templateUrl: './descendencia-modal.component.html',
})
export class DescendenciaModalComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @Input()
  persona!: Person;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  @Input()
  accion!: string;

  destroy$ = new Subject<void>();

  parejas: UnionSummaryDto[]=[];
  unionSelected: UnionSummaryDto | null | undefined=null;

  loading = false;

  visibleModalSpouse: boolean = false;
  visibleModalChildren: boolean = false;

  constructor(
    private _personService : PersonService,
    private _unionService: UnionService,
  ){
  }

  ngOnInit(){
    this.loadUnions();
    if(this.accion==='addSpouse'){
      this.visibleModalSpouse = true
    }
  }

  loadUnions(){
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


  cerrar() {
    this.cerrarDialog.emit();
  }

  mostrarMensaje(event:any) {
    this.msjEvent.emit(event);
  }

  closeDialogAddSpouse(update:boolean) {
    this.visibleModalSpouse = false;
    if(update){
      this.loadUnions();
    }
  }

  closeDialogAddChildren(update:boolean) {
    this.visibleModalChildren = false;
    if(update){
      this.loadUnions();
    }
  }

  actionEventButton(event:EventAccion):void{
    if(event.accion==='addSpouse'){
      this.visibleModalSpouse = true
    }

    if(event.accion==='addChildren'){
      this.unionSelected=event.union;
      this.visibleModalChildren = true
    }
  }

}
