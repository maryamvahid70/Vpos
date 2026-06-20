import { Component } from '@angular/core';

@Component({
  selector: 'app-block-ui-template',
  standalone:false,
  templateUrl: './block-ui-template.component.html',
  styleUrl: './block-ui-template.component.scss'
})
export class BlockUiTemplateComponent {
  message: string = '';
}
