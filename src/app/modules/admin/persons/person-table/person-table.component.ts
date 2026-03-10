import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Person} from '../../../../core/models/person.model';
import {FormsModule} from '@angular/forms';
import {TooltipModule} from 'primeng/tooltip';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-person-table',
  standalone: true,
  imports: [FormsModule, TooltipModule, TableModule],
  templateUrl: './person-table.component.html'
})
export class PersonTableComponent {

  @Input() persons: Person[] = [];

  @Output() save = new EventEmitter<Person>();
  @Output() delete = new EventEmitter<Person>();
  @Output() editInit = new EventEmitter<Person>();

}
