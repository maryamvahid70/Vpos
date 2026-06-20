import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-icon',
  standalone:false,
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss'
})
export class SvgIconComponent {
  @Input() name: string = '';
  @Input() size?: number = 24;
}
