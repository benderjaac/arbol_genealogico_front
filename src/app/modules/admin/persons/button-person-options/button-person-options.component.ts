import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {TieredMenu} from "primeng/tieredmenu";
import {Tooltip} from "primeng/tooltip";
import {Person} from '../../../../core/models/person.model';

export interface EventAccion {
    persona: Person, accion: string
};

@Component({
  selector: 'app-button-person-options',
    imports: [
        ButtonDirective,
        TieredMenu,
        Tooltip
    ],
  templateUrl: './button-person-options.component.html',
})
export class ButtonPersonOptionsComponent {

  @Input() persona!: Person;
  @Input() notdescendencia: boolean=false;

  actionsMenuItems: any[] = [];
  @Output() actionEvent = new EventEmitter<EventAccion>();

  openActionsMenu(event: Event, persona: Person, menu: any) {

    this.actionsMenuItems = [
      {
        label: 'Ver descendencia',
        icon: 'pi pi-arrow-circle-down',
        command: () => this.actionEvent.emit({persona: persona, accion: 'showChildren'})
      },
      {
        separator: true
      },
      {
        label: 'Agregar pareja',
        icon: 'pi pi-heart',
        command: () => this.actionEvent.emit({persona: persona, accion: 'addSpouse'})
      },
      {
        label: 'Agregar hijos',
        icon: 'pi pi-users',
        command: () => this.actionEvent.emit({persona: persona, accion: 'addChildren'})
      }
    ];

    if(this.notdescendencia){
      this.actionsMenuItems.shift();
    }

    menu.toggle(event);
  }
}
