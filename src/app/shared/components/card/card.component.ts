import { Component, ContentChild, ElementRef, EventEmitter, HostListener, INJECTOR, Input, Output, ViewChild } from '@angular/core';
import { IContextMenuItem } from '../../../core/interfaces/context-menu-item.interface';
import { HelperService } from '../../services/helper.service';
import { IExpandablePanelPostion } from '../../../core/interfaces/expandable-panel-position.interface';
import { ICardActionConfig } from '../../../core/interfaces/card-action-config';

@Component({
  selector: 'app-card',
  standalone:false,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent<T> {
  @Input() cardTitle: {parent:string,child:string} | string = {parent:'',child:''};
  @Input() showPageNumber: boolean = false;
  @Input() pageNumber: number = 0;
  @Input() data: any;
  @Input() actionMenuItems: ICardActionConfig<T>[] = [];
  @Input() actionMenuBorderColor?: string = 'var(--primary-02)';
  @Input() actionMenuType: 'expandable' | 'button' | 'none' = 'none';
  @Input() showCardTitleIcon: boolean = true;
  @Input() cardTitleIcon: string = '';
  @Input() showSearchIcon?: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() background?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error';
  @Input() backgroundType?: 'highlight';
  @Input() hasFullHeight: boolean = true;
  @ContentChild('cardExtra') cardExtra!: ElementRef;

  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('actionMenuTrigger') actionMenuTrigger!: ElementRef;
  actionMenuPosition: IExpandablePanelPostion = {}
  isMobile: boolean = false;
  constructor(private helperService:HelperService){}
  showMenu: boolean = false;
  hasCustomExtra = false;

  @HostListener('window:resize', ['$event'])
  userInfo: string[] = [];
  onResize() {
    this.isMobile = window.matchMedia("(max-width: 575px)").matches ? true : false;
  }
  ngOnInit() {
    this.onResize();
  }
  ngAfterContentInit() {
    this.hasCustomExtra = !!this.cardExtra;
  }
  onShowMenu(event:MouseEvent) {
    this.showMenu = true
    const domRect: DOMRect = this.helperService.calcMouseEventPosition(event);
    this.actionMenuPosition.top = domRect.top + domRect.height + 16;
    this.actionMenuPosition.left = domRect.left;
  }
  onCloseMenu() {
    this.showMenu = false;
  }

  onSearchSelected(event: any) {
    if (event.type == 'search') {
      event.preventDefault();
      return
    }
    else if(typeof event == 'string') {
      this.onSearch.emit(event)
    }
  }
}
