import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentComponent } from './shared/components/layout/content/content.component';
import { content } from './shared/routes/content';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

const routes: Routes = [
  { path: 'auth', loadChildren: ()=> import('./modules/auth/auth.module').then(m => m.AuthModule) },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '', component: ContentComponent, children: content },
  { path: "**", redirectTo: 'spec-pages/error-404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      anchorScrolling: "enabled",
      scrollPositionRestoration: "top",
      useHash: true
    })],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule { }
