import { CommonModule } from '@angular/common';
import {ChangeDetectorRef, Component, signal, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AhorroDeposito } from 'app/core/models/ahorro-deposito.model';
import { Ahorro } from 'app/core/models/ahorro.model';
import { ApiSort } from 'app/core/models/query.model';
import { ResponseApiType } from 'app/core/models/response-api.model';
import { AhorroService } from 'app/core/services-api/ahorro.service';
import { AhorroDepositoService } from 'app/core/services-api/ahorroDeposito.service';
import { FilterService } from 'app/modules/utils/filter.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBar } from 'primeng/progressbar';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { Subject, takeUntil } from 'rxjs';
import {Ripple} from 'primeng/ripple';
import { Dialog } from "primeng/dialog";
import { AhorroEditComponent } from "../ahorro-edit/ahorro-edit.component";
import { AhorroDepositoCreateComponent } from "../ahorroDeposito-create/ahorroDeposito-create.component";
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { BalanceUsuarioService } from 'app/core/services-api/balance-usuario.service';
import { Select } from "primeng/select";

@Component({
  selector: 'app-ahorro-detalle',
  imports: [ConfirmPopupModule, TooltipModule, InputNumberModule, FormsModule, DatePickerModule, Toast, TableModule, CommonModule, ButtonModule, ProgressBar, Ripple, Dialog, AhorroEditComponent, AhorroDepositoCreateComponent, Select],
  templateUrl: './ahorro-detalle.component.html',
  providers: [ConfirmationService, MessageService]
})
export class AhorroDetalleComponent {
  destroy$ = new Subject<void>();

  idAhorro! : number;
  ahorro!: Ahorro;
  porcentaje!:number;

  @ViewChild('dt') dt!: Table;

  ahorroDepositos : AhorroDeposito[] = [];
  totalRecords = 0;

  rowsPerPageOptions: number[] = [];
  rowsDefault = 0;
  OrderDefault: ApiSort[] = [{field:'fecha', order:'DESC'}];

  lastEvent : TableLazyLoadEvent|null = null;
  showFilters : boolean = false;

  loading = false;

  visibleEdit = false;
  visibleDeposito = false;
  tipoDeposito: 'deposito' | 'retiro' = 'deposito';

  filtroFechaRango: Date[] = [];
  filterFecharango=false;

  clonedAhorroDeposito: { [s: string]: AhorroDeposito } = {};

  constructor(
    private _ahorroService: AhorroService,
    private _ahorroDepositoService: AhorroDepositoService,
    private _filterService: FilterService,
    private _messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private confirmationService: ConfirmationService,
    private _balanceUsuarioService: BalanceUsuarioService,
  ){
    this.rowsPerPageOptions = [10, 20, 50, 100]
    this.rowsDefault = this.rowsPerPageOptions[0];
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.idAhorro = parseInt(params['id'], 10);
      this.obtenerDetalle();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  obtenerDetalle():void{
    this._ahorroService.getById(this.idAhorro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.ahorro = resp.result;
          this.porcentaje= Math.round((this.ahorro.monto_actual / this.ahorro.monto_meta) * 100)
        },
        error: (error) => {
          console.error(error);
          this.router.navigateByUrl('/finanzas/ahorro/list/');
        }
      });
  }

  getData(event: TableLazyLoadEvent|null):void{
    this.lastEvent=event;
    this.loading = true;
    const ApiQuery = this._filterService.buildQuery(event!, this.rowsDefault, this.OrderDefault);
    this._ahorroDepositoService.getData(this.idAhorro, ApiQuery)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: ResponseApiType<AhorroDeposito>)=>{
          this.ahorroDepositos = res.result.data;
          this.totalRecords = res.result.pagination.totalItems;
          this.loading = false;
        },
        error: (error)=> {
          this.ahorroDepositos=[];
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
        this.getData(this.lastEvent);
      }
    }
  }

  onFilterInput(event: Event, field: string, tipo:string) {
    const input = event.target as HTMLInputElement;
    this.dt.filter(input.value, field, tipo);
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
      this.getData(this.lastEvent);
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
    this.getData(event);
  }

  mostrarMensaje(detalle: {tipo:string, mensaje:string}) {
    this._messageService.add({
      severity: detalle.tipo,
      summary: detalle.tipo==='error'?'Error de registro':'Exito de registro',
      detail: detalle.mensaje,
      life: 3000
    });
  }

  onRowEditInit(ahorroDeposito: AhorroDeposito) {
    this.cancelAllActiveEditions();
    this.clonedAhorroDeposito[ahorroDeposito.id as unknown as string] = { ...ahorroDeposito };
    ahorroDeposito.editing = true;
  }

  onRowEditSave(ahorroDeposito: AhorroDeposito, ri:any) {
    ahorroDeposito.fecha= new Date(ahorroDeposito.fecha).toISOString().split('T')[0];
    const values = {
      monto: ahorroDeposito.monto,
      descri: ahorroDeposito.descri,
      fecha: ahorroDeposito.fecha,
    };

    this._ahorroDepositoService.update(this.idAhorro, values, ahorroDeposito.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._balanceUsuarioService.setBalance(res.result);
          this._messageService.add({
            severity: 'success',
            summary: 'Movimiento actualizado correctamente',
            detail: res.message
          });
          ahorroDeposito.editing = false;
          delete this.clonedAhorroDeposito[ahorroDeposito.id as unknown as string];
          this.obtenerDetalle();
          this.reloadTable();
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al actualizar el movimiento',
            detail: error.error.error
          });
          this.onRowEditCancel(ahorroDeposito, ri);
        }
      });

  }

  onRowEditCancel(ahorroDeposito: AhorroDeposito, index: number) {
    console.log('onRowEditCancel');
    if (this.clonedAhorroDeposito[ahorroDeposito.id as unknown as string]) {
      this.ahorroDepositos[index] = { ...this.clonedAhorroDeposito[ahorroDeposito.id as unknown as string] };
      delete this.clonedAhorroDeposito[ahorroDeposito.id as unknown as string];
    }
    this.dt.cancelRowEdit(this.ahorroDepositos[index]);
    ahorroDeposito.editing = false;
  }

  cancelAllActiveEditions(): void {
    this.ahorroDepositos.forEach((ahorroDeposito, index) => {
      if (ahorroDeposito.editing) {
        this.onRowEditCancel(ahorroDeposito, index);
      }
    });

    this.cdr.detectChanges();
  }

  onEdit(ahorro: Ahorro): void {
    this.visibleEdit=true;
  }

  openFormDeposito(ahorroId: number, tipo: 'deposito'|'retiro'): void {
    this.visibleDeposito = true;
    this.tipoDeposito = tipo;
  }

  closeDialog(update:boolean, form: string) {
    if(update){
      this.obtenerDetalle();
      this.reloadTable();
    }
    if(form==='edit'){
      this.visibleEdit = false;
      return;
    }
    if(form==='deposito'){
      this.visibleDeposito = false;
      return;
    }
  }

  onDelete(ahorroDeposito:AhorroDeposito, event: Event):void{
    this.confirmationService.close();

    setTimeout(() => {
      this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: '¿Estás seguro de eliminar: "' + ahorroDeposito.descri + '"?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Eliminar',
          rejectLabel: 'Cancelar',
          acceptButtonStyleClass: 'p-button-sm p-button-danger',
          rejectButtonStyleClass: 'p-button-sm p-button-text',
          closeOnEscape: true,
          accept: () => {
              this.deleteItem(ahorroDeposito.id);
          },
          reject: () => {
          }
      });
    }, 200);

  }

  deleteItem(id:number):void{
    this._ahorroDepositoService.delete(this.idAhorro, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._balanceUsuarioService.setBalance(res.result);
          this._messageService.add({
            severity: 'success',
            summary: 'Deposito eliminado correctamente',
            detail: res.message
          });
          this.obtenerDetalle();
          this.reloadTable();
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al eliminar el deposito',
            detail: error.error.error
          });
        }
      });
  }

  onFilterSelect(event: any, field: string, tipo:string) {
    this.dt.filter(event, field, tipo);
  }
}
