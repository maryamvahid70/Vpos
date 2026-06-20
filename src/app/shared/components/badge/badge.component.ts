import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone:false,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() label: string = '';
  @Input() color: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error' | 'gray' = 'primary';
  @Input() colorMode: 'solid' | 'highlight' | 'outline' = 'highlight';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' = 'xs';
  @Input() iconName: string = 'check-circle';
  @Input() iconSize: number = 16;
  @Input() iconDirection: "left" | 'right' = 'right';
  @Input() showIcon: boolean = true;
  
}
