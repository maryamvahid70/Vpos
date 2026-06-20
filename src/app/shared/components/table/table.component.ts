import { ChangeDetectorRef, Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { AppSetting } from '../../../core/resources/app-setting';
import { ResultViewModel } from '../../../core/viewModels/result-view-model';
import { ITableActionConfig } from '../../../core/interfaces/table-action-config.interface';
import { ITableActionEvent } from '../../../core/interfaces/table-action-event.interface';
import { TableMainActionsConfig } from '../../../core/types/table-main-actions-config';
import { ITableExtraColumns } from '../../../core/interfaces/table-extra-columns.interface';
@Component({
  selector: 'app-table',
  standalone: false,
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  @Input() columns: Array<{ Key: string, Title: string, TemplateRef?:TemplateRef<any> }> = [];
  @Input() extraColumns: Array<ITableExtraColumns<any>> = [];
  @Input() mainActions: TableMainActionsConfig<any> = {};
  @Input() customActions: Array<ITableActionConfig<any>> = [];
  @Input() pageSize: number = 15;
  @Input() showPagination: boolean = true;
  @Input() isLoading: boolean = true;
  @Input() useCheckboxInsteadOfSwitcher: boolean = false;
  @Output() onDisable: EventEmitter<any> = new EventEmitter<any>();
  @Output() buttonAction: EventEmitter<ITableActionEvent<any>> = new EventEmitter<ITableActionEvent<any>>();
  @Output() pageChange: EventEmitter<{ pageNumber: number; pageSize: number }> = new EventEmitter();
  @Input() set data(value: ResultViewModel<any>) {
    if (value.Message?.Status !== '') {
      this._data = value;
    }
  }
  get data(): ResultViewModel<any> {
    return this._data;
  }

  setting: AppSetting = new AppSetting();
  filter: string = '';
  pageNumber: number = 1;
  allActions: ITableActionConfig<any>[] = [];
  _data!: ResultViewModel<any>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getAllActions();
  }

  
  onPaginateChange(event: { pageNumber: number, pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.pageChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize })
  }

  onButtonAction(customAction: ITableActionEvent<any>) {
    this.buttonAction.emit(customAction);
  }

  getAllActions() {
    const config = this.mainActions;
    const actions: ITableActionConfig<any>[] = [];

    if (config.edit) {
      actions.push({
        title: config.edit.title || 'ویرایش',
        icon: config.edit.icon || 'pen2',
        type: config.edit.type || 'iconic',
        ...config.edit,
      });
    }

    if (config.remove) {
      actions.push({
        title: config.remove.title || 'حذف',
        icon: config.remove.icon || 'trash-bin-minimalistic',
        type: config.remove.type || 'iconic',
        ...config.remove,
      });
    }

    if (config.view) {
      actions.push({
        title: config.view.title || 'جزئیات',
        icon: config.view.icon || 'eye',
        type: config.view.type || 'iconic',
        ...config.view,
      });
    }

    if (config.openFolder) {
      actions.push({
        title: config.openFolder.title || 'پرونده',
        icon: config.openFolder.icon || 'folder-with-files',
        type: config.openFolder.type || 'iconic',
        ...config.openFolder,
      });
    }

    this.allActions = [...actions, ...this.customActions];
  }
}
