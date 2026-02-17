import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Movimiento } from 'app/core/models/movimiento.model';
import { MovimientoService } from 'app/core/services-api/movimiento.service';
import { Subject, takeUntil } from 'rxjs';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ApiSort } from 'app/core/models/query.model';
import { FilterService } from 'app/modules/utils/filter.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { Dialog } from 'primeng/dialog';
import { GastoCreateComponent } from '../gasto-create/gasto-create.component';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CatalogoStoreService } from '../../servicios/catalogo-store.service';
import { Categoria } from 'app/core/models/categoria.model';
import { Select } from 'primeng/select';
import {Ripple} from 'primeng/ripple';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {IngresoCreateComponent} from '../ingreso-create/ingreso-create.component';
import { CategoriaLabelComponent } from "../../shared/categoria-label/categoria-label.component";

@Component({
  selector: 'app-movimiento-list',
  imports: [ConfirmPopupModule, TooltipModule, Select, InputNumberModule, FormsModule, DatePickerModule, GastoCreateComponent, Dialog, Toast, TableModule, CommonModule, ButtonModule, Ripple, IngresoCreateComponent, CategoriaLabelComponent],
  templateUrl: './movimiento-list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class MovimientoListComponent {

  @ViewChild('dt') dt!: Table;

  movimientos : Movimiento[] = [];
  totalRecords = 0;

  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;
  OrderDefault: ApiSort[] = [{field:'fecha', order:'DESC'}];

  lastEvent : TableLazyLoadEvent|null = null;
  showFilters : boolean = false;

  loading = false;

  visibleAddGasto = false;
  visibleAddIngreso = false;

  filtroFechaRango: Date[] = [];
  filterFecharango=false;

  catCategorias : Categoria[] = [];

  clonedItems: { [s: string]: Movimiento } = {};

  destroy$ = new Subject<void>();

  constructor(
    private _gastoService: MovimientoService,
    private _filterService: FilterService,
    private _messageService: MessageService,
    private _catalogoStoreService: CatalogoStoreService,
    private cdr: ChangeDetectorRef,
    private _balanceUsuarioService: BalanceUsuarioService,
    private confirmationService: ConfirmationService,
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];
  }

  ngOnInit():void{
    this._catalogoStoreService.getCatalogo('categorias')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.catCategorias = resp.result.data;
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDataItems(event: TableLazyLoadEvent):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event, this.rowsDefault, this.OrderDefault);
    this._gastoService.getData(ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<Movimiento>)=>{
          this.movimientos = res.result.data;
          this.movimientos.map(g => {
            this.dt.cancelRowEdit(g);
            g.editing = false
          });
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;
        },
        error: (error)=> {
          this.movimientos=[];
          this.totalRecords = 0;
          this.loading = false;
          this._messageService.add(
            { severity: 'error', summary: 'Error de consulta', detail: error.error.message, life: 3000 }
          );
        }
      });
  }

  addGasto():void{
    this.visibleAddGasto=true;
  }

  addIngreso():void{
    this.visibleAddIngreso=true;
  }

  closeDialog(update:boolean) {
    this.visibleAddGasto = false;
    this.visibleAddIngreso = false;
      if(update){
        this.reloadTable();
      }
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

  onFilterSelect(event: any, field: string, tipo:string) {
    this.dt.filter(event, field, tipo);
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

  onFilterNumberInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    const number = Number(input.value);
    const [desde, hasta] = [Math.round(number-(number*0.15)), Math.round(number*1.15)];
    this.dt.filter([desde, hasta], field, tipo);
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

  mostrarMensaje(detalle: {tipo:string, mensaje:string}) {
    this._messageService.add({
      severity: detalle.tipo,
      summary: detalle.tipo==='error'?'Error de registro':'Exito de registro',
      detail: detalle.mensaje,
      life: 3000
    });
  }

  onRowEditInit(movimiento: Movimiento) {
    this.cancelAllActiveEditions();
    this.clonedItems[movimiento.id as unknown as string] = { ...movimiento };
    movimiento.editing = true;
  }

  onRowEditSave(movimiento: Movimiento, ri: number) {
    movimiento.fecha= new Date(movimiento.fecha).toISOString().split('T')[0];

    const values = {
      monto: movimiento.monto,
      tipo: movimiento.tipo,
      descri: movimiento.descri,
      categoriaId: movimiento.categoria_id,
      fecha: movimiento.fecha,
    };

    this._gastoService.update(movimiento.id, values)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._balanceUsuarioService.setBalance(res.result);
          this._messageService.add({
            severity: 'success',
            summary: 'Movimiento actualizado correctamente',
            detail: res.message
          });
          movimiento.editing = false;
          delete this.clonedItems[movimiento.id as unknown as string];
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al actualizar el movimiento',
            detail: error.error.error
          });
          this.onRowEditCancel(movimiento, ri);
        }
      });

  }

  onRowEditCancel(movimiento: Movimiento, index: number) {
    if (this.clonedItems[movimiento.id as unknown as string]) {
      this.movimientos[index] = { ...this.clonedItems[movimiento.id as unknown as string] };
      delete this.clonedItems[movimiento.id as unknown as string];
    }
    this.dt.cancelRowEdit(this.movimientos[index]);
    movimiento.editing = false;
  }

  cancelAllActiveEditions(): void {
    this.movimientos.forEach((movimiento, index) => {
      if (movimiento.editing) {
        this.onRowEditCancel(movimiento, index);
      }
    });

    this.cdr.detectChanges();
  }

  onCategoriaChange(event: any, movimiento: Movimiento) {
    const categoriaSeleccionada = this.catCategorias.find(cat => cat.id === event.value);

    if (categoriaSeleccionada) {
        movimiento.categoria_id = categoriaSeleccionada.id;
        movimiento.categoriaNombre = categoriaSeleccionada.nombre;
        movimiento.categoriaIcon = categoriaSeleccionada.icon;
        movimiento.categoriaColor = categoriaSeleccionada.color;
    }
  }

  onDelete(movimiento:Movimiento, event: Event):void{
    this.confirmationService.close();

    setTimeout(() => {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: '¿Estás seguro de eliminar: "' + movimiento.descri + '"?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Eliminar',
          rejectLabel: 'Cancelar',
          acceptButtonStyleClass: 'p-button-sm p-button-danger',
          rejectButtonStyleClass: 'p-button-sm p-button-text',
          closeOnEscape: true,
          accept: () => {
              this.deleteItem(movimiento.id);
          },
          reject: () => {
          }
      });
    }, 200);

  }

  deleteItem(id:number):void{
    this._gastoService.delete(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._balanceUsuarioService.setBalance(res.result);
          this._messageService.add({
            severity: 'success',
            summary: 'Movimiento eliminado correctamente',
            detail: res.message
          });
          this.reloadTable();
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al eliminar el movimiento',
            detail: error.error.error
          });
        }
      });
  }

  filterByTipo(catCategorias: Categoria[], tipo:string):Categoria[]{
    return catCategorias.filter(cat => cat.tipo === tipo)
  }

}
