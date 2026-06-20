import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContextMenuItem } from '../../../core/interfaces/context-menu-item.interface';
import { IExpandablePanelPostion } from '../../../core/interfaces/expandable-panel-position.interface';
import { AppSetting } from '../../../core/resources/app-setting';
@Component({
  selector: 'app-context-menu',
  standalone:false,
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent {
  @Input() position: IExpandablePanelPostion = {};
  @Input() menuItems: IContextMenuItem[] = [];
  @Output() closeMenu: EventEmitter<void> = new EventEmitter();
  setting: AppSetting = new AppSetting();
  onMenuItemClick(action: () => void) {
    action(); // Call the provided action function
    this.closeMenu.emit(); // Emit close event after action
  }

  closeContextMenu() {
    this.closeMenu.emit();
  }
}
