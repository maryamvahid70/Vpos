import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { AppSetting } from '../../../core/resources/app-setting';

@Component({
  selector: 'app-pagination',
  standalone: false,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() pageNumber = 1;
  @Input() pageSize = 15;
  @Input() id: string = '';
  @Output() onPaginationChange: EventEmitter<{ pageNumber: number; pageSize: number }> = new EventEmitter();
  setting: AppSetting = new AppSetting();
  isMobile: boolean = false;
  @HostListener('window:resize', ['$event'])

  public pageSizesList: Array<Object> = [
    { id: 1, value: 5 },
    { id: 2, value: 10 },
    { id: 3, value: 15 },
    { id: 4, value: 20 },
    { id: 5, value: 30 },
    { id: 6, value: 40 },
    { id: 7, value: 50 },
  ];

  onResize() {
    this.isMobile = window.matchMedia("(max-width: 575px)").matches ? true : false;
  }
  ngOnInit() {
    this.onResize()
  }
  pageSizeChanged() {
    this.pageNumber = 1;
    this.emitPaginationChanged();
  }
  pageNumberChanged(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.emitPaginationChanged();
  }
  emitPaginationChanged() {
    this.onPaginationChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize })

  }
}
