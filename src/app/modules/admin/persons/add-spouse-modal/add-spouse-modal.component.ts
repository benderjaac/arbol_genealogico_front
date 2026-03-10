import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Person} from '../../../../core/models/person.model';
import {AutoComplete, AutoCompleteCompleteEvent} from 'primeng/autocomplete';
import {ButtonDirective} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {PersonService} from '../../../../core/services-api/person.service';
import {UnionService} from '../../../../core/services-api/union.service';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-add-spouse-modal',
  imports: [
    AutoComplete,
    ButtonDirective,
    FormsModule
  ],
  templateUrl: './add-spouse-modal.component.html',
})
export class AddSpouseModalComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @Input()
  persona!: Person;

  @ViewChild('usernameInput') usernameInput!: ElementRef;

  selectedSpouse: Person | null = null;
  filteredPersons: Person[] = [];
  parejaIds: number[] = [];

  loading:boolean = false;
  destroy$ = new Subject<void>();

  constructor(
    private _personService : PersonService,
    private _unionService: UnionService,
  ){
  }

  crearUnion() {

    if (!this.selectedSpouse) return;

    this.loading = true;

    this._unionService.create({
      person1Id: this.persona.id,
      person2Id: this.selectedSpouse.id
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
