import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ResultViewModel } from '../../../core/viewModels/result-view-model';
import { MessageViewModel } from '../../../core/viewModels/message-view-model';
import { HttpClient } from '@angular/common/http';
import { SwalService } from '../../../shared/services/alert.service';
import { TerminalViewModel } from '../../../core/viewModels/terminal-view-model';
import { VoucherViewModel } from '../../../core/viewModels/voucher-view-model';
import { TableMainActionsConfig } from '../../../core/types/table-main-actions-config';
import { ITableActionEvent } from '../../../core/interfaces/table-action-event.interface';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { VoucherSummaryViewModel } from '../../../core/viewModels/voucher-summary-view-model';
import { ResponsiveService } from '../../../shared/services/responsive-services';
import { appConfig } from '../../../../app.config';

@Component({
  selector: 'app-invoice',
  standalone: false,
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {

  @ViewChild('transferDetail') detailTemplate!: TemplateRef<any>;
  @ViewChild('dateTimeTemplateRef') dateTimeTemplateRef!:TemplateRef<any>;

  isLoading = false;
  message = new MessageViewModel;
  terminalInfo: TerminalViewModel = new TerminalViewModel();
  list: ResultViewModel<VoucherSummaryViewModel> = new ResultViewModel<VoucherSummaryViewModel>();
  detailData: VoucherViewModel = new VoucherViewModel();
  tableMainActions: TableMainActionsConfig<VoucherViewModel> = {
    view: {
      title: 'جزییات',
      icon: 'alt-arrow-left',
      buttonColorType: 'outline',
      leftIcon: true,
      type: 'text',
      buttonSize: 'sm',
      action: (item: VoucherViewModel) => this.onViewItem(item)
    }
  }

  tableColumns: {Key:string, Title: string, TemplateRef?:TemplateRef<any>}[] = [];

  constructor(private http: HttpClient, private swal: SwalService, private modalService: NgbModal, public responsiveService: ResponsiveService) { }

  ngOnInit(): void {
    this.message.Status = 'success';
    const tInfo = localStorage.getItem('terminalInfo');
    if (tInfo && tInfo !== '')
      this.terminalInfo = JSON.parse(tInfo);

    this.geLatestVouchersOfMyTerminal();
  }


  ngAfterViewInit(){
    this.tableColumns = [
      { Key: 'VoucherNumber', Title: 'شماره سند' },
      { Key: 'DateTime', Title: 'تاریخ و ساعت تراکنش', TemplateRef: this.dateTimeTemplateRef },
      { Key: 'TransactionTypeTitle', Title: 'نوع تراکنش' },
      { Key: 'Amount', Title: 'مبلغ (ریال)' },
    ]
  }


  geLatestVouchersOfMyTerminal() {
    this.http
      .get<ResultViewModel<VoucherSummaryViewModel>>(`${appConfig.apiBaseUrl}/webVPOS/geLatestVouchersOfMyTerminal/${this.terminalInfo.ID}`).subscribe({
        next: (res: ResultViewModel<VoucherSummaryViewModel>) => {
          this.list = res
        },
      });
  }

  onViewItem(item: VoucherViewModel) {
    this.detailData = item;
    const option: NgbModalOptions = { backdrop: 'static', keyboard: false, size: 'lg',  windowClass: this.responsiveService.isMobile()?'mobile-modal':''  };
    this.modalService.open(this.detailTemplate, option);
  }

  handleButtonAction(event: ITableActionEvent<any>) {
    event.action(event.data)
  }
}
