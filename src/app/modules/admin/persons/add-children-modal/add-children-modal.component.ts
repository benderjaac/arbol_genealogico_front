import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Person} from '../../../../core/models/person.model';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {PersonService} from '../../../../core/services-api/person.service';
import {UnionService} from '../../../../core/services-api/union.service';
import {Subject, takeUntil} from 'rxjs';
import {UnionSummaryDto} from '../../../../core/models/UnionSummary.model';
import {UnionChildService} from '../../../../core/services-api/union-child.service';

@Component({
  selector: 'app-add-children-modal',
  imports: [
    AutoComplete,
    ButtonDirective,
    FormsModule
  ],
  templateUrl: './add-children-modal.component.html',
})
export class AddChildrenModalComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @Input()
  persona!: Person;

  @Input()
  union!: UnionSummaryDto | null | undefined;

  @ViewChild('usernameInput') usernameInput!: ElementRef;

  selectedPerson: Person | null = null;
  filteredPersons: Person[] = [];
  parejaIds: number[] = [];

  loading:boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private _personService : PersonService,
    private _unionChildService: UnionChildService,
  ){
  }

  crearUnionChild() {

    if (!this.selectedPerson) return;

    this.loading = true;

    this._unionChildService.create({
      unionId: this.union?.unionId!,
      childId: this.selectedPerson.id
    }).subscribe({
      next: () => {
        this.cerrarDialog.emit(true);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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

  cancelCreate(){
    this.cerrarDialog.emit(false);
  }
}
