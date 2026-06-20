import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-search',
  standalone:false,
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  animations: [
    trigger('toggleSearch', [
      state('closed', style({
        width: '40px',
        // opacity: 0,
        overflow: 'hidden',
      })),
      state('open', style({
        width: '200px',
        // opacity: 1,
      })),
      transition('closed <=> open', [
        animate('300ms ease-in-out')
      ]),
    ])
  ]
})
export class SearchComponent {

  searchIsOpen: boolean = false;
  value: string = '';
  @Input() searchPlaceholder: string = 'جستجو...';
  @Input() collapsible: boolean = true;

  @Output() onSearch: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('searchInput', {static:true}) searchInput!: ElementRef;

  constructor(private eRef: ElementRef) {}
  onSearchSelected(event: any) {
    event.preventDefault();
  
    // اگر قابلیت جمع‌شوندگی نداریم، فقط جستجو انجام بده
    if (!this.collapsible) {
      if (this.value && this.value.trim() !== '') {
        this.onSearch.emit(this.value.trim());
      }
      return;
    }
  
    // اگر قابلیت جمع‌شوندگی داریم
    if (this.searchIsOpen) {
      if (this.value && this.value.trim() !== '') {
        this.onSearch.emit(this.value.trim());
      }
    } else {
      this.searchIsOpen = true;
      setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
    }
  }
  

  onClearSearch(e: any){
    this.value = '';
    this.onSearch.emit(this.value.trim());
    if (this.collapsible) {
      
      this.searchIsOpen = false;
    }else{
      this.searchIsOpen = true;

    }
  }

  @HostListener('document:click', ['$event']) clickOutside(event: MouseEvent) {
    if (!this.collapsible) return; // در حالت بدون جمع‌شوندگی کاری نکن
    if (!this.eRef.nativeElement.contains(event.target) && !this.value) {
      this.searchIsOpen = false;
    }
  }
  ngOnInit() {
    if (!this.collapsible) {
      this.searchIsOpen = true;
    }
  }
  
}
