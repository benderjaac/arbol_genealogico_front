import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Categoria } from 'app/core/models/categoria.model';
import { ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { CategoriaGastoService } from 'app/core/services-api/categoria-gasto.service';
import { FilterService } from 'app/modules/utils/filter.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import { CategoriaCreateComponent } from '../categoria-create/categoria-create.component';
import { Select } from "primeng/select";
import { CategoriaLabelComponent } from "../../shared/categoria-label/categoria-label.component";

@Component({
  selector: 'app-categoria-list',
  imports: [Toast, TableModule, CategoriaCreateComponent, Dialog, CommonModule, ButtonModule, Select, CategoriaLabelComponent],
  templateUrl: './categoria-list.component.html',
  standalone: true,
  providers: [MessageService]
})
export class CategoriaListComponent {
  
  @ViewChild('dt') dt!: Table;

  categoriasG : Categoria[] = [];
  totalRecords = 0;
  
  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;
  OrderDefault: ApiSort[] = [{field:'id', order:'DESC'}];

  lastEvent : TableLazyLoadEvent|null = null;
  showFilters : boolean = false;

  loading = false;

  visibleAdd = false;

  destroy$ = new Subject<void>();

  constructor(
    private _categoriaGastoService: CategoriaGastoService,
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
  
  getCategoriasGastoData(event: TableLazyLoadEvent):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
    this._categoriaGastoService.getDataCategorias(ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<Categoria>)=>{
          this.categoriasG = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;          
        },
        error: (error)=> {
          this.categoriasG=[];
          this.totalRecords = 0;
          this.loading = false;
          this._messageService.add(
            { severity: 'error', summary: 'Error de consulta', detail: error.error.message, life: 3000 }
          );
        }
      });
  }

  addGasto():void{

  }

  showHiddeFilters(){
    this.showFilters=!this.showFilters;
    if(!this.showFilters){
      if (this.lastEvent!=null) {
        this.dt.filters={};
        this.lastEvent.filters={};
        this.getCategoriasGastoData(this.lastEvent);
      }
    }
  }

  onFilterInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, field, tipo);
  } 

  reloadTable():void{
    if (this.lastEvent!=null) {
      this.getCategoriasGastoData(this.lastEvent);
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
    this.getCategoriasGastoData(event); // dispara la carga manual
  }

  mostrarMensaje(detalle: {tipo:string, mensaje:string}) {
    this._messageService.add({
      severity: detalle.tipo,
      summary: detalle.tipo==='error'?'Error de registro':'Exito de registro',
      detail: detalle.mensaje,
      life: 3000
    });
  }

  addCategoria():void{
    this.visibleAdd=true;
  }

  closeDialog(update:boolean) {
      this.visibleAdd = false;
      if(update){
        this.reloadTable();
      }
  }

  onFilterSelect(event: any, field: string, tipo:string) {
    this.dt.filter(event, field, tipo);
  }
}
