//Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FileUploadModule } from 'ng2-file-upload';
import { SimplebarAngularModule } from 'simplebar-angular';
import { NgPersianDatepickerModule } from 'ng-persian-datepicker';
import { BlockUIModule } from 'ng-block-ui';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BaseChartDirective } from 'ng2-charts';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
//Directives
import { ClickOutsideDirective } from './directives/click-out-side.directive';
import { RightClickDirective } from './directives/right-click.directive';
import { Ipv4ValidatorDirective } from './directives/ip-validator.directive';
import { PersianLettersOnlyDirective } from './directives/persian-letters-only.directive';
import { MaskitoDirective } from '@maskito/angular';
import { MobileValidatorDirective } from './directives/mobile-validator.directive';
import { EmailValidatorDirective } from './directives/email-validator.directive';
import { PasswordValidatorDirective } from './directives/password-validator.directive';
import { NumberRequiredDirective } from './directives/number-required.directive';
import { NumberSeparatorDirective } from './directives/number-seprator-directive';

//Components
import { HeaderComponent } from './components/header/header.component';
import { PersianCalendarComponent } from './components/persian-calendar/persian-calendar.component';
import { SvgIconComponent } from './components/svg-icon/svg-icon.component';
import { ExpandablePanelComponent } from './components/expandable-panel/expandable-panel.component';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { BlockUiTemplateComponent } from './components/block-ui-template/block-ui-template.component';
import { FullComponent } from './components/layout/full/full.component';
import { ContentComponent } from './components/layout/content/content.component';
import { TextInputComponent } from './components/text-input/text-input.component';
import { JalaliDatePickerComponent } from './components/jalali-date-picker/jalali-date-picker.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { SwitcherComponent } from './components/switcher/switcher.component';
import { CardComponent } from './components/card/card.component';
import { SearchComponent } from './components/search/search.component';
import { ButtonComponent } from './components/button/button.component';
import { BadgeComponent } from './components/badge/badge.component';
import { LoadingComponent } from './components/loading/loading.component';
import { CustomErrorModalComponent } from './components/custom-error-modal/custom-error-modal.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TableComponent } from './components/table/table.component';


@NgModule({
  declarations: [
    PersianCalendarComponent,
    SvgIconComponent,
    ExpandablePanelComponent,
    ContextMenuComponent,
    FullComponent,
    ContentComponent,
    TextInputComponent,
    JalaliDatePickerComponent,
    PaginationComponent,
    NoDataComponent,
    SwitcherComponent,
    CardComponent,
    SearchComponent,
    HeaderComponent,
    ButtonComponent,
    BadgeComponent,
    NumberRequiredDirective,
    LoadingComponent,
    CustomErrorModalComponent,
    SidebarComponent,
    TableComponent,
    NumberSeparatorDirective
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgSelectModule,
    CarouselModule,
    AngularEditorModule,
    FileUploadModule,
    BlockUIModule.forRoot({template: BlockUiTemplateComponent, message:'در حال پردازش؛ شکیبا باشید ...'}),
    NgPersianDatepickerModule,
    SimplebarAngularModule,
    NgxPaginationModule,
    NgApexchartsModule,
    ClickOutsideDirective,
    RightClickDirective,
    Ipv4ValidatorDirective,
    PersianLettersOnlyDirective,
    MaskitoDirective,
    MobileValidatorDirective,
    EmailValidatorDirective,
    PasswordValidatorDirective,
    BaseChartDirective,
    HttpClientModule,
  ],
  exports: [
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    CarouselModule,
    AngularEditorModule,
    FileUploadModule,
    NgPersianDatepickerModule,
    SimplebarAngularModule,
    BlockUIModule,
    NgxPaginationModule,
    NgApexchartsModule,
    ClickOutsideDirective,
    RightClickDirective,
    Ipv4ValidatorDirective,
    PersianLettersOnlyDirective,
    MaskitoDirective,
    MobileValidatorDirective,
    EmailValidatorDirective,
    PasswordValidatorDirective,
    BaseChartDirective,    
    PersianCalendarComponent,
    SvgIconComponent,
    ExpandablePanelComponent,
    ContextMenuComponent,
    TextInputComponent,
    JalaliDatePickerComponent,
    PaginationComponent,
    NoDataComponent,
    SwitcherComponent,
    CardComponent,
    SearchComponent,
    ButtonComponent,
    BadgeComponent,
    NumberRequiredDirective,
    LoadingComponent,
    TableComponent,
    HttpClientModule,
    NumberSeparatorDirective
  ],
  providers:[
    provideCharts(withDefaultRegisterables())
  ]
  
})
export class SharedModule { }
