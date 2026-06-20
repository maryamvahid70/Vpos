import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnitTestRoutingModule } from './unit-test-routing.module';
import { TesterComponent } from './tester/tester.component';


@NgModule({
  declarations: [
    TesterComponent
  ],
  imports: [
    CommonModule,
    UnitTestRoutingModule
  ]
})
export class UnitTestModule { }
