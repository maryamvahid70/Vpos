import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { SpecRoutingModule } from './spec-routing.module';
import { Error401Component } from './error-401/error-401.component';
import { Error404Component } from './error-404/error-404.component';
import { Error403Component } from './error-403/error-403.component';
@NgModule({
  declarations: [Error401Component, Error404Component,Error403Component],
  imports: [
    CommonModule,
    SharedModule,
    SpecRoutingModule
  ]
})
export class SpecPagesModule { }
