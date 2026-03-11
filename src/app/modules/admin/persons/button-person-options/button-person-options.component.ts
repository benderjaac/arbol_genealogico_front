import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {TieredMenu} from "primeng/tieredmenu";
import {Tooltip} from "primeng/tooltip";
import {Person} from '../../../../core/models/person.model';
import {UnionSummaryDto} from '../../../../core/models/UnionSummary.model';

export interface EventAccion {
  persona: Person,
  union?: UnionSummaryDto | null,
  accion: string
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
  @Input() union!: UnionSummaryDto | null;
  @Input() notdescendencia: boolean=false;
  @Input() notpareja: boolean=false;
  @Input() notchild: boolean=false;

  actionsMenuItems: any[] = [];
  @Output() actionEvent = new EventEmitter<EventAccion>();

  openActionsMenu(event: Event, persona: Person, menu: any, union:UnionSummaryDto|null=null) {

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
        command: () => this.actionEvent.emit({persona: persona, union: union, accion: 'addChildren'})
      }
    ];

    if(this.notdescendencia){
      delete this.actionsMenuItems[0];
    }

    if(this.notpareja){
      delete this.actionsMenuItems[2];
    }

    if(this.notchild){
      delete this.actionsMenuItems[3];
    }

    this.actionsMenuItems=this.actionsMenuItems.filter(
      item => item!==undefined
    );



    menu.toggle(event);
  }
}
