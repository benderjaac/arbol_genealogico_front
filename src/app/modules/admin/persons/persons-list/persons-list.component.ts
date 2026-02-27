
import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import { ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { FilterService } from 'app/modules/utils/filter.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import {PersonService} from '../../../../core/services-api/person.service';
import {Person} from '../../../../core/models/person.model';
import {DatePickerModule} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {Genero} from '../../../../core/enums/enums';
import {ConfirmPopup} from 'primeng/confirmpopup';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-users-list',
  imports: [Dialog, Toast, TableModule, ButtonModule, DatePickerModule, FormsModule, Select, ConfirmPopup, NgIf],
  templateUrl: './persons-list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class PersonsListComponent {

  @ViewChild('dt') dt!: Table;

  personas : Person[] = [];
  totalRecords = 0;

  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;
  OrderDefault: ApiSort[] = [{field:'id', order:'DESC'}];

  lastEvent : TableLazyLoadEvent|null = null;
  showFilters : boolean = false;

  loading = false;

  visibleAddUser = false;

  filtroFechaRango: Date[] = [];
  filterFecharango=false;
  clonedItems: { [s: string]: Person } = {};

  public readonly Genero = Genero;

  destroy$ = new Subject<void>();

  constructor(
    private _personService: PersonService,
    private _filterService: FilterService,
    private _messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];
  }

  ngOnInit():void{

  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDataItems(event: TableLazyLoadEvent):void{
    this.lastEvent=event;
    this.loading = true;

    const ApiQuery = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
    this._personService.getDataPersons(ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<Person>)=>{
          this.personas = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;
        },
        error: (error)=> {
          this.personas=[];
          this.totalRecords = 0;
          this.loading = false;
          this._messageService.add(
            { severity: 'error', summary: 'Error de consulta', detail: error.error.message, life: 3000 }
          );
        }
      });
  }

  showHiddeFilters(){
    this.showFilters=!this.showFilters;
    if(!this.showFilters){
      if (this.lastEvent!=null) {
        this.dt.filters={};
        this.lastEvent.filters={};
        this.getDataItems(this.lastEvent);
      }
    }
  }

  onFilterInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, field, tipo);
  }

  reloadTable():void{
    if (this.lastEvent!=null) {
      this.getDataItems(this.lastEvent);
    }
  }

  resetTable():void{
    this.dt.clear();
    this.dt.sortField = this.OrderDefault[0].field;
    this.dt.sortOrder = 1;
    this.filtroFechaRango=[];

    const event = {
      first: 0,
      rows: this.rowsDefault,
      sortField: null,
      sortOrder: null,
      filters: {},
      globalFilter: null
    };
    this.showFilters=false;
    this.getDataItems(event);
  }

  addUser():void{
    this.visibleAddUser=true;
  }

  closeDialog(update:boolean) {
      this.visibleAddUser = false;
      if(update){
        this.reloadTable();
      }
  }

  mostrarMensaje(detalle: {tipo:string, mensaje:string}) {
    this._messageService.add({
      severity: detalle.tipo,
      summary: detalle.tipo==='error'?'Error de registro':'Exito de registro',
      detail: detalle.mensaje,
      life: 3000
    });
  }

  onFilterExactDate(date: Date, field: string): void {
    this.dt.filter(date, field, 'equals');
    this.filtroFechaRango=[];
  }

  onFilterDateRange(dates: any, field: string): void {
    if (dates && dates.length === 2 && dates[0] && dates[1]) {
      const [startDate, endDate] = dates;
      this.dt.filter([startDate, endDate], field, 'between');
    }
  }

  onFilterSelect(event: any, field: string, tipo:string) {
    this.dt.filter(event, field, tipo);
  }

  getLabelGenero(key: string): string {
    return Genero[key as keyof typeof Genero] || 'No especificado';
  }

  onRowEditInit(persona: Person) {
    this.cancelAllActiveEditions();
    this.clonedItems[persona.id as unknown as string] = { ...persona };
    persona.editing = true;
  }

  cancelAllActiveEditions(): void {
    this.personas.forEach((persona, index) => {
      if (persona.editing) {
        this.onRowEditCancel(persona, index);
      }
    });

    this.cdr.detectChanges();
  }

  onRowEditCancel(persona: Person, index: number) {
    if (this.clonedItems[persona.id as unknown as string]) {
      this.personas[index] = { ...this.clonedItems[persona.id as unknown as string] };
      delete this.clonedItems[persona.id as unknown as string];
    }
    this.dt.cancelRowEdit(this.personas[index]);
    persona.editing = false;
  }

  onDelete(persona:Person, event: Event):void{
    this.confirmationService.close();

    setTimeout(() => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Estás seguro de eliminar: "' + persona.nombreCompleto + '"?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Eliminar',
        rejectLabel: 'Cancelar',
        acceptButtonStyleClass: 'p-button-sm p-button-danger',
        rejectButtonStyleClass: 'p-button-sm p-button-text',
        closeOnEscape: true,
        accept: () => {
          this.deleteItem(persona.id);
        },
        reject: () => {
        }
      });
    }, 200);

  }

  deleteItem(id:number):void{
    this._personService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Persona eliminada correctamente',
            detail: res.message
          });
          this.reloadTable();
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al eliminar',
            detail: error.error.error
          });
        }
      });
  }

  onRowEditSave(persona: Person, ri: number) {
    persona.fechaNacimiento= new Date(persona.fechaNacimiento).toISOString().split('T')[0];

    const values = {
      nombre: persona.nombre,
      apellidoPaterno: persona.apellidoPaterno,
      apellidoMaterno: persona.apellidoMaterno,
      alias: persona.alias,
      fechaNacimiento: persona.fechaNacimiento,
      genero: persona.genero,
      lugarNacimiento: persona.lugarNacimiento,
      notas: persona.notas,
    };

    this._personService.update(persona.id, values)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Persona actualizada correctamente',
            detail: res.message
          });
          persona.editing = false;
          persona.nombreCompleto = res.result.nombreCompleto;
          delete this.clonedItems[persona.id as unknown as string];
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al actualizar',
            detail: error.error.error
          });
          this.onRowEditCancel(persona, ri);
        }
      });

  }

}
