
import { Component, ViewChild } from '@angular/core';
import { ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { FilterService } from 'app/modules/utils/filter.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { Dialog } from 'primeng/dialog';
import {PersonService} from '../../../../core/services-api/person.service';
import {Person} from '../../../../core/models/person.model';

@Component({
  selector: 'app-users-list',
  imports: [Dialog, Toast, TableModule, ButtonModule],
  templateUrl: './persons-list.component.html',
  providers: [MessageService]
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

  destroy$ = new Subject<void>();

  constructor(
    private _personService: PersonService,
    private _filterService: FilterService,
    private _messageService: MessageService,
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

  getPersonsData(event: TableLazyLoadEvent):void{
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
        this.getPersonsData(this.lastEvent);
      }
    }
  }

  onFilterInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, field, tipo);
  }

  reloadTable():void{
    if (this.lastEvent!=null) {
      this.getPersonsData(this.lastEvent);
    }
  }

  resetTable():void{
    this.dt.clear();
    this.dt.sortField = this.OrderDefault[0].field;
    this.dt.sortOrder = 1;

    const event = {
      first: 0,
      rows: this.rowsDefault,
      sortField: null,
      sortOrder: null,
      filters: {},
      globalFilter: null
    };
    this.showFilters=false;
    this.getPersonsData(event);
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

}
