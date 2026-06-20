import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data',
  standalone:false,
  templateUrl: './no-data.component.html',
  styleUrl: './no-data.component.scss'
})
export class NoDataComponent {
  @Input() imageWidth?: string = '8.375rem';
  @Input() imageHeight?: string = '6.6875rem';
  @Input() fontSize?: string = '0.875rem';
  @Input() noDataText?:string = 'داده ای برای نمایش وجود ندارد.'

}