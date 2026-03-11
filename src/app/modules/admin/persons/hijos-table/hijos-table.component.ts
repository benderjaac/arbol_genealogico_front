import {Component, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {Person} from '../../../../core/models/person.model';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';
import {TableModule} from 'primeng/table';
import {ButtonDirective} from 'primeng/button';
import {ConfirmPopup} from 'primeng/confirmpopup';
import {Ripple} from 'primeng/ripple';
import {Subject, takeUntil} from 'rxjs';
import {PersonService} from '../../../../core/services-api/person.service';
import {FilterService} from '../../../utils/filter.service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {UnionChildService} from '../../../../core/services-api/union-child.service';

@Component({
  selector: 'app-hijos-table',
  standalone: true,
  imports: [FormsModule, TooltipModule, TableModule, ButtonDirective, ConfirmPopup, Ripple],
  templateUrl: './hijos-table.component.html'
})
export class HijosTableComponent {

  @Input() persons: Person[] = [];
  @Input() unionId: number = 0;

  @Output() deleteChild = new EventEmitter<boolean>();

  @Output() save = new EventEmitter<Person>();
  @Output() delete = new EventEmitter<Person>();
  @Output() editInit = new EventEmitter<Person>();

  destroy$ = new Subject<void>();

  constructor(
    private _unionChildService: UnionChildService,
    private _messageService: MessageService,
    private confirmationService: ConfirmationService,
  ){
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete(persona:Person, event: Event):void{
    this.confirmationService.close();

    setTimeout(() => {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Estás seguro de desvincular: "' + persona.nombreCompleto + '"?',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Desvincular',
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

  deleteItem(personId:number):void{
    this._unionChildService.delete(this.unionId, personId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this._messageService.add({
            severity: 'success',
            summary: 'Hijo desvinculado correctamente',
            detail: res.message
          });
          this.deleteChild.emit(true);
        },
        error: (error) => {
          this._messageService.add({
            severity: 'error',
            summary: 'Error al desvincular',
            detail: error.error.error
          });
        }
      });
  }
}
