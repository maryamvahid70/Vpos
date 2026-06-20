import { Component, ElementRef, HostListener, Input, Output, QueryList, ViewChild, ViewChildren, EventEmitter, SimpleChanges, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgForm } from '@angular/forms';
//ViewModels
import { CalendarDimensionModel } from '../../../core/models/calendar-dimension-model';
import { CalendarFilterDateModel  } from '../../../core/models/calendar-filter-date-model';
import { EventModel } from '../../../core/models/event-model';
//Plugins
import { gregorianToJalali } from 'shamsi-date-converter';
import { AppSetting } from '../../../core/resources/app-setting';
@Component({
  selector: 'app-persian-calendar',
  standalone:false,
  templateUrl: './persian-calendar.component.html',
  styleUrls: ['./persian-calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('slideDown', [
          state('void', style({
            height: '0',
            overflow:'hidden',
            opacity: 0,
            visibility: 'hidden'

            
          })),
          state('*', style({
            height: '*',
            overflow:'visible',
            opacity: 1,
            visibility: 'visible'
          })),
          transition('void => *', [
            animate('300ms ease-out')
          ]),
          transition('* => void', [
            animate('300ms ease-in')
          ])
    ]),
    trigger('fade', [
      state('void', style({
        opacity: '0',
        visibility:'hidden'
      })),
      state('*', style({
        opacity: '1',
        visibility:'visible'
      })),
      transition('void => *', [
        animate('300ms ease-out')
      ]),
      transition('* => void', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class PersianCalendarComponent {
  @Input() days: Array<CalendarDimensionModel> = [];
  @Input() dayNamesType:string = 'long';
  @Input() events: Array<EventModel> = [];
  @Input() editable: boolean = false;
  @Input() showEvents: boolean = true;
  @Input() showGregDate: boolean = true;
  @Input() showBody: boolean = false;
  @Input() showHijriDate: boolean = true;
  @Input() hasError: boolean = false;
  @Input() isLoading: boolean = true;
  @Input() primaryColor: string = '';
  @Input() secondaryColor: string = '';
  @Input() fontColor: string = '';
  @Input() isDayFilterable?: boolean = false;
  @Input() showToggleCalendar: boolean = true;
  @Output() yearAndMonthFilterEmitter: EventEmitter<CalendarFilterDateModel> = new EventEmitter<CalendarFilterDateModel>();
  @Output() submitEditDay: EventEmitter<EventModel> = new EventEmitter<EventModel>();
  @Output() daySelected: EventEmitter<CalendarDimensionModel> = new EventEmitter<CalendarDimensionModel>();
  showDaysCountError: boolean = false;
  showFilterSection: boolean = false;
  showEditForm: boolean = false;
  nowDate = gregorianToJalali(new Date());
  today = `${this.nowDate[0]}/${ this.nowDate[1] }/${ this.nowDate[2] }`
  currentYear:number = 0;
  currentMonth: number = 0;
  filterYearValue: number = 0;
  filterMonthValue: number = 0;
  yearPageSize: number = 12;
  yearPageNumber: number = 1;
  yearTotalPageCount: number = 1;
  editFormHeight = 160;
  editFormwidth = 230;
  editFormPosition: { top: string, left: string } = { top: '0px', left: '0px' };
  editDayTrigger: HTMLElement | null = null;
  editDayTriggerIndex: number = 0;
  requestEditDay: EventModel = new EventModel();
  monthList = [
    { index: 1, title: 'فروردین' },
    { index: 2, title: 'اردیبهشت' },
    { index: 3, title: 'خرداد' },
    { index: 4, title: 'تیر' },
    { index: 5, title: 'امرداد' },
    { index: 6, title: 'شهریور' },
    { index: 7, title: 'مهر' },
    { index: 8, title: 'آبان' },
    { index: 9, title: 'آذر' },
    { index: 10, title: 'دی' },
    { index: 11, title: 'بهمن' },
    { index: 12, title: 'اسفند' },
  ]
  yearList: Array<number> = [];
  slicedYearList: Array<number> = [];
  setting: AppSetting = new AppSetting();
  @ViewChildren('editDayTrigger') editDayTriggers!: QueryList<ElementRef>;
  @ViewChild('editDateForm') editDateForm: ElementRef | null = null;
  constructor(private cdr: ChangeDetectorRef) { }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const element = event.target as HTMLElement;
    const target = document.querySelector('.edit-date-form-wrapper');
    const clickedInside = target?.contains(element);
    const clickedOnExclude = element.isEqualNode(this.editDayTrigger);
    if (this.showEditForm && !clickedInside && !clickedOnExclude) {
      this.closeEditForm();
    }
  }
  
  ngOnInit() {
    this.generateYearList();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['days'] ) {
      this.generateCalendarData();
    }
    if (changes['hasError'] && !changes['hasError'].firstChange) {
      this.cdr.detectChanges();
    }
    if (this.primaryColor) {
      document.documentElement.style.setProperty("--calendar-primary-color", this.primaryColor);
    }
    if (this.secondaryColor) {
      document.documentElement.style.setProperty("--calendar-secondary-color", this.secondaryColor);
    }
    if (this.fontColor) {
      document.documentElement.style.setProperty("--fontColor", this.secondaryColor);
    }
    
  }

  generateCalendarData() {
    if (this.days.length) {
      this.currentYear = this.days[0].YearKey;
      this.currentMonth = this.days[0].MonthKey;
      if (this.currentMonth >= 1 && this.currentMonth <= 6) {
        this.showDaysCountError = this.days.length == 31 ? false : true;
      }
      else if (this.currentMonth >= 7 && this.currentMonth <= 11) {
        this.showDaysCountError = this.days.length == 30 ? false : true;
      }
      else if (this.currentMonth == 12) {
          this.showDaysCountError = this.days[0].IsLeap && this.days.length == 30 ? false : !this.days[0].IsLeap && this.days.length == 29 ? false : true;
      }
      this.updateYearPageNumber(this.currentYear);
    }
    else {
      this.showDaysCountError = true;
    }
  }

  generateYearList() {
    this.yearList = Array.from({ length: 1450 - 1300 + 1 }, (_, i) => 1300 + i).reverse(); // create yearList
    this.yearTotalPageCount = Math.round(this.yearList.length / this.yearPageSize); //get yearTotalPageCount
    this.updateYearPageNumber(this.nowDate[0])
  }
  updateYearPageNumber(year: number) {
    const yearIndex = this.yearList.indexOf(year) ;
    if (yearIndex != -1) {
      this.yearPageNumber = Math.floor(yearIndex / this.yearPageSize) + 1;
    }
    this.sliceYearList();
  }
  sliceYearList() {
    this.slicedYearList = [...this.yearList.slice((this.yearPageNumber - 1) * this.yearPageSize, (this.yearPageNumber) * this.yearPageSize)];
  }
  
  navigateToPreviousMonth() { 
    if (this.currentMonth > 1) {
      this.currentMonth--;
    }
    else if (this.currentMonth <= 1) {
      this.currentMonth = 12
      this.currentYear--;
    }
    this.generateMonthAndYearFilter(this.currentYear,this.currentMonth)
  }
  navigateToNextMonth() {
    if (this.currentMonth < 12) {
      this.currentMonth++;
    }
    else if (this.currentMonth >= 12) {
      this.currentMonth = 1;
      this.currentYear++;
    }
    this.generateMonthAndYearFilter(this.currentYear,this.currentMonth)
  }
  generateMonthAndYearFilter(Year: number, Month: number) {
    const newDate: CalendarFilterDateModel = { Year, Month };
    this.yearAndMonthFilterEmitter.emit(newDate)
  }
  openFilterSection() {
    if (!this.showFilterSection) {
      this.filterYearValue = this.currentYear; //save current state
      this.filterMonthValue = this.currentMonth; //save current state
      this.showFilterSection = true;
    }
  }
  cancleFilter() {
    this.showFilterSection = false;
  }
  selectYear(value:number) {
    this.filterYearValue = value;
  }
  selectMonth(value: number) {
    this.filterMonthValue = value;
  }
  applyFilter() {
    this.showFilterSection = false;
    this.generateMonthAndYearFilter(this.filterYearValue, this.filterMonthValue);
  }
  loadNextYearPage() {
    this.yearPageNumber++;
    this.sliceYearList()
  }
  loadPreviousYearPage() {
    this.yearPageNumber--;
    this.sliceYearList();
  }
  refresh() {
    this.generateMonthAndYearFilter(this.nowDate[0], this.nowDate[1]);
  }

  openEditForm(event: MouseEvent, day: CalendarDimensionModel, index: number) {
    this.editDayTriggerIndex = index;
    this.setExcludeElements();
    this.requestEditDay.ID = day.ID;
    this.requestEditDay.DayKey = day.DayKey;
    this.requestEditDay.IsHoliday = day.IsHoliday;
    this.showEditForm = true;
    // Get clicked day element
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    // Get calendar container dimensions
    const calendarBody = document.querySelector('.calendar-container .body') as HTMLElement;
    const bodyRect = calendarBody.getBoundingClientRect();
    const dFromTop = ((bodyRect.top + bodyRect.height) - (rect.top - rect.height)) - bodyRect.height;
    const dFromLeft = ((bodyRect.left + bodyRect.width) - (rect.left - rect.width)) - bodyRect.width;
    let positionTop: number = 0;
    let positionLeft: number = 0;;
    if (Math.abs(dFromTop) < this.editFormHeight) {
      positionTop = rect.top + rect.height + 5
    }
    else if (Math.abs(dFromTop) >= this.editFormHeight) {
      positionTop = rect.bottom - this.editFormHeight
    }
    if (Math.abs(dFromLeft) < this.editFormwidth) {
      positionLeft = rect.left 
    }
    else if (Math.abs(dFromLeft) >= this.editFormwidth) {
      positionLeft = rect.left - this.editFormwidth + rect.width
    }
    this.editFormPosition = { top: `${positionTop}px`, left: `${positionLeft}px` };
  }
  closeEditForm() {
    this.showEditForm = false;
    this.requestEditDay = new EventModel();
    this.editDayForm.resetForm();
  }
  setExcludeElements() {
    this.editDayTrigger = this.editDayTriggers.map(item=>item.nativeElement)[this.editDayTriggerIndex]
  }
  @ViewChild('editDayForm') editDayForm!:NgForm
  onUpdateDay() {
    if (this.editDayForm.valid) {
      this.submitEditDay.emit(this.requestEditDay);
      this.closeEditForm();
    }
  }

  onDaySelected(day: CalendarDimensionModel) {
    this.daySelected.emit(day)
    
  }
  
  onToggleShowBodySelected() {
    this.showFilterSection = false;
    this.showBody = !this.showBody;
  }

}
