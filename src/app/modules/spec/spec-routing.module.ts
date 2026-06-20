import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error401Component } from './error-401/error-401.component';
import { Error404Component } from './error-404/error-404.component';
import { Error403Component } from './error-403/error-403.component';

const routes: Routes = [
  {
    path: '', children: [
    
      { path:'error-401', component:Error401Component },
      { path: 'error-404', component: Error404Component },
      { path: 'error-403', component: Error403Component },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpecRoutingModule { }
